"use client";

import { Book, CategoriesOnBooks, Category, Rating } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { BookmarkSimple, BookOpen, Books, UserList } from "phosphor-react";

import { api } from "@/lib/axios";

import { Avatar } from "@/components/Avatar";

interface AsideProfileProps {
  userId: string;
}

export type ProfileRating = Rating & {
  book: Book & {
    categories: CategoriesOnBooks &
      {
        category: Category;
      }[];
  };
};

export type ProfileData = {
  ratings: ProfileRating[];
  user: {
    avatar_url: string;
    name: string;
    member_since: string;
  };
  readPages: number;
  ratedBooks: number;
  readAuthors: number;
  mostReadCategory?: string;
};

export function AsideProfile({ userId }: AsideProfileProps) {
  const { data: profile } = useQuery<ProfileData>({
    queryKey: ["user", userId],
    queryFn: async () => {
      const { data } = await api.get(`/profile/${userId}`);

      return data?.profile ?? {};
    },
  });

  return (
    <div className="flex flex-col items-center py-5">
      <div className="flex flex-col items-center gap-5">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-vertical">
          <Avatar image={profile?.user.avatar_url} size="lg" />
        </div>

        <div className="space-y-0">
          <h2 className="text-center text-xl font-bold">
            {profile?.user.name}
          </h2>

          <h3 className="text-center text-sm text-gray-400">
            membro desde {dayjs(profile?.user.member_since).get("year")}
          </h3>
        </div>
      </div>

      <div className="my-8 h-1 w-8 rounded-full bg-gradient-horizontal"></div>

      <div className="flex flex-col gap-10">
        <div className="flex items-center gap-5">
          <BookOpen size={32} className="text-green-100" />

          <div>
            <h4 className="text-base font-bold">{profile?.readPages}</h4>
            <p className="text-sm">Páginas lidas</p>
          </div>
        </div>

        <div className="flex items-center gap-5">
          <Books size={32} className="text-green-100" />

          <div>
            <h4 className="text-base font-bold">{profile?.ratedBooks}</h4>
            <p className="text-sm">Livros avaliados</p>
          </div>
        </div>

        <div className="flex items-center gap-5">
          <UserList size={32} className="text-green-100" />

          <div>
            <h4 className="text-base font-bold">{profile?.readAuthors}</h4>
            <p className="text-sm">Autores lidos</p>
          </div>
        </div>

        <div className="flex items-center gap-5">
          <BookmarkSimple size={32} className="text-green-100" />

          <div>
            <h4 className="text-base font-bold">{profile?.mostReadCategory}</h4>
            <p className="text-sm">Categoria mais lida</p>
          </div>
        </div>
      </div>
    </div>
  );
}
