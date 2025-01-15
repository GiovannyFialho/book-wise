"use client";

import { Book, CategoriesOnBooks, Category, Rating } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import relativeTime from "dayjs/plugin/relativeTime";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { CaretLeft, MagnifyingGlass } from "phosphor-react";
import { useMemo, useState } from "react";

import { api } from "@/lib/axios";

import { AsideProfile, type ProfileData } from "@/components/AsideProfile";
import { RatingStars } from "@/components/RatingStars";

dayjs.extend(relativeTime);
dayjs.locale("pt-br");

export type ProfileRating = Rating & {
  book: Book & {
    categories: CategoriesOnBooks &
      {
        category: Category;
      }[];
  };
};

interface ProfileQuery extends ProfileData {
  ratings: ProfileRating[];
}

interface ProfileContentProps {
  userId: string;
}

export function ProfileContent({ userId }: ProfileContentProps) {
  const [search, setSearch] = useState("");
  const { data: session } = useSession();

  const { data: profile, isLoading } = useQuery<ProfileQuery>({
    queryKey: ["user", userId],
    queryFn: async () => {
      const { data } = await api.get(`/profile/${userId}`);

      return data?.profile ?? {};
    },
  });

  const filteredRatings = useMemo(() => {
    return profile?.ratings.filter((rating) => {
      return rating.book.name.toLowerCase().includes(search.toLowerCase());
    });
  }, [profile, search]);

  const asideProfileData: ProfileData = {
    user: {
      avatar_url: profile?.user?.avatar_url ?? "",
      name: profile?.user?.name ?? "-",
      member_since: profile?.user?.member_since ?? "-",
    },
    readPages: profile?.readPages ?? 0,
    ratedBooks: profile?.ratedBooks ?? 0,
    readAuthors: profile?.readAuthors ?? 0,
    mostReadCategory: profile?.mostReadCategory ?? "-",
  };

  return (
    <>
      {userId !== session?.user.id && (
        <Link href="/" className="mt-5 flex items-center gap-3">
          <CaretLeft size={20} />
          Voltar
        </Link>
      )}

      <div
        className={`flex flex-1 gap-16 ${userId !== session?.user.id ? "mt-5" : "mt-10"}`}
      >
        <section className="w-full">
          <div className="flex flex-1 flex-col gap-8">
            <div className="flex min-h-12 items-center gap-2 rounded-md border border-gray-500 px-5 py-3">
              <input
                type="text"
                placeholder="Buscar livro avaliado"
                className="w-full bg-transparent"
                onChange={({ target }) => setSearch(target.value)}
              />

              <MagnifyingGlass size={20} className="text-gray-500" />
            </div>

            <div className="flex flex-col gap-6">
              {filteredRatings?.map((rateBook) => (
                <div key={rateBook.id} className="flex flex-col gap-2">
                  <p className="text-sm text-gray-300">
                    {dayjs().to(dayjs(rateBook.created_at))}
                  </p>

                  <div className="flex w-full flex-col gap-6 rounded-lg bg-gray-700 p-6">
                    <div className="flex gap-6">
                      <Image
                        className="w-24 rounded-md"
                        src="https://m.media-amazon.com/images/I/91M9xPIf10L._SY466_.jpg"
                        width={98}
                        height={134}
                        alt={rateBook.book.name}
                      />

                      <div className="flex flex-col justify-between">
                        <div>
                          <h3 className="text-lg font-bold">
                            {rateBook.book.name}
                          </h3>
                          <p className="text-sm text-gray-400">
                            {rateBook.book.author}
                          </p>
                        </div>

                        <RatingStars rate={rateBook.rate} />
                      </div>
                    </div>

                    <p className="text-sm text-gray-300">
                      {rateBook.description}
                    </p>
                  </div>
                </div>
              ))}

              {!filteredRatings ||
                (filteredRatings.length <= 0 && (
                  <p className="text-sm">Nenhum resultado encontrado</p>
                ))}
            </div>
          </div>
        </section>

        <aside className="h-auto w-full max-w-[300px]">
          <AsideProfile {...asideProfileData} isLoading={isLoading} />
        </aside>
      </div>
    </>
  );
}
