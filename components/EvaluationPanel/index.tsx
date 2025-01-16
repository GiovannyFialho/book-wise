"use client";

import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import relativeTime from "dayjs/plugin/relativeTime";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { BookmarkSimple, BookOpen, Check, X } from "phosphor-react";
import { useState } from "react";

dayjs.extend(relativeTime);
dayjs.locale("pt-br");

import { api } from "@/lib/axios";

import { handleSignIn } from "@/components/AuthOptionButtons";
import { Avatar } from "@/components/Avatar";
import { type Rating } from "@/components/PopularBooks";
import { RatingStars } from "@/components/RatingStars";
import { StarRating } from "@/components/StarRating";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";

import GitHubIcon from "@/assets/icons/github-icon.svg";
import GoogleIcon from "@/assets/icons/google-icon.svg";

interface BookDataRating extends Rating {
  user: {
    id: string;
    name: string;
    email: string | null;
    avatar_url: string;
    created_at: string;
  };
}

interface BookDataCategories {
  book_id: string;
  categoryId: string;
  category: {
    id: string;
    name: string;
  };
}

interface BookData {
  book: {
    id: string;
    name: string;
    author: string;
    summary: string;
    cover_url: string;
    total_pages: number;
    created_at: Date;
    categories: BookDataCategories[];
    ratings: BookDataRating[];
    avgRating: number;
  };
}

interface EvaluationPanelProps {
  id: string | null;
  onClosed: () => void;
}

export function EvaluationPanel({ id, onClosed }: EvaluationPanelProps) {
  const { data: session, status: sessionStatus } = useSession();

  const [authDiagloOpen, setAuthDiagloOpen] = useState(false);
  const [newEvaluationOpen, setNewEvaluationOpen] = useState(false);
  const [charCount, setCharCount] = useState(0);

  const maxLength = 450;

  const { data, isLoading } = useQuery<BookData>({
    queryKey: ["book-detail", id],
    queryFn: async () => {
      const response = await api.get(`/books/details/${id}`);

      return response.data;
    },
    enabled: !!id,
  });

  return (
    <>
      <SheetContent className="custom-scrollbar w-full overflow-y-auto border-gray-800 bg-gray-800 p-12 sm:max-w-[660px]">
        <SheetHeader>
          <SheetTitle className="text-3xl font-bold text-gray-100">
            Detalhes do livro
          </SheetTitle>
          <SheetDescription className="text-base text-gray-100">
            Você pode avaliar e acompanhar outras avaliações de outros usuários
          </SheetDescription>
        </SheetHeader>

        <div className="mt-5 flex flex-col gap-10">
          {isLoading || !data ? (
            <>
              <Skeleton className="h-[400px] w-full rounded-md bg-gray-500" />

              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-28 rounded-sm bg-gray-500" />

                  <Skeleton className="h-4 w-16 rounded-sm bg-gray-500" />
                </div>

                <div className="flex flex-col gap-3">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <Skeleton
                      key={index}
                      className="h-40 w-full rounded-md bg-gray-500"
                    />
                  ))}
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="rounded-md bg-gray-700 px-8 py-6">
                <div className="flex gap-8 border-b border-b-gray-600 pb-10">
                  <Image
                    src={data.book.cover_url}
                    width={170}
                    height={242}
                    alt={data.book.name}
                    className="h-60 w-40"
                  />

                  <div className="flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg font-bold">{data.book.name}</h3>
                      <h4 className="text-base text-gray-300">
                        {data.book.author}
                      </h4>
                    </div>

                    <div>
                      <RatingStars rate={data.book.avgRating} />
                      <p className="text-sm text-gray-400">
                        {data.book.ratings.length} avaliações
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex w-full justify-start gap-14 px-0 py-6">
                  <div className="flex items-center gap-4">
                    <BookmarkSimple size={24} className="text-green-100" />

                    <div>
                      <h5 className="text-sm text-gray-300">Categoria</h5>

                      <p className="text-base font-bold">
                        {data.book.categories
                          .map((category) => category.category.name)
                          .join(", ")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <BookOpen size={24} className="text-green-100" />

                    <div>
                      <h5 className="text-sm text-gray-300">Páginas</h5>

                      <p className="text-base font-bold">
                        {data.book.total_pages}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm text-gray-200">Avaliações</h2>

                  {!newEvaluationOpen && (
                    <button
                      type="button"
                      className="text-base font-bold text-purple-100"
                      onClick={() => {
                        if (sessionStatus === "unauthenticated") {
                          setAuthDiagloOpen(true);
                        }

                        if (sessionStatus === "authenticated") {
                          setNewEvaluationOpen(true);
                        }
                      }}
                    >
                      Avaliar
                    </button>
                  )}
                </div>

                <div className="flex flex-col gap-3">
                  {newEvaluationOpen && (
                    <div className="flex w-full flex-col gap-6 rounded-md bg-gray-700 p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <Avatar
                            image={session?.user.avatar_url ?? undefined}
                            size="sm"
                          />

                          <h5 className="text-base font-bold">
                            {session?.user.name}
                          </h5>
                        </div>

                        <StarRating onRate={(rate) => console.log({ rate })} />
                      </div>

                      <div className="flex flex-col items-end gap-3">
                        <div className="relative w-full rounded-sm border-gray-500 bg-gray-800">
                          <Textarea
                            placeholder="Escreva sua avaliação"
                            maxLength={maxLength}
                            className="custom-scrollbar min-h-32 border-0 bg-transparent text-sm text-gray-200"
                            onChange={(event) =>
                              setCharCount(event.target.value.length)
                            }
                          />

                          <span className="absolute bottom-2 right-3 text-xs text-[#7C7C8A]">
                            {charCount}/{maxLength}
                          </span>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            type="button"
                            className="h-10 w-10 bg-gray-600"
                            onClick={() => {
                              setNewEvaluationOpen(false);
                              onClosed();
                            }}
                          >
                            <X size={24} className="text-purple-100" />
                          </Button>

                          <Button
                            type="submit"
                            className="h-10 w-10 bg-gray-600"
                          >
                            <Check size={24} className="text-green-100" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  {data.book.ratings.map((rating) => (
                    <div
                      key={rating.id}
                      className="flex flex-col gap-5 rounded-md bg-gray-700 p-6"
                    >
                      <div className="flex justify-between">
                        <div className="flex items-center gap-4">
                          <Avatar image={rating.user.avatar_url} size="sm" />

                          <div>
                            <h5 className="text-base font-bold">
                              {rating.user.name}
                            </h5>
                            <p className="text-sm text-gray-400">
                              {dayjs().to(dayjs(rating.created_at))}
                            </p>
                          </div>
                        </div>

                        <RatingStars rate={rating.rate} />
                      </div>

                      <p className="text-sm text-gray-300">
                        {rating.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </SheetContent>

      <AlertDialog open={authDiagloOpen} onOpenChange={setAuthDiagloOpen}>
        <AlertDialogContent className="max-w-2xl rounded-md border-gray-700 bg-gray-700 px-16 py-14">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-center text-xl font-bold">
              Faça login para deixar sua avaliação
            </AlertDialogTitle>

            <AlertDialogDescription className="text-center text-base text-gray-100">
              Escolha uma das opções abaixo
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="mb-5 mt-10 flex flex-col gap-4">
            <button
              type="button"
              className="flex items-center gap-5 rounded-lg bg-gray-600 px-6 py-5 transition-all duration-300 hover:bg-gray-700"
              onClick={() => handleSignIn("google")}
            >
              <Image src={GoogleIcon} alt="" />
              Entrar com Google
            </button>

            <button
              type="button"
              className="flex items-center gap-5 rounded-lg bg-gray-600 px-6 py-5 transition-all duration-300 hover:bg-gray-700"
              onClick={() => handleSignIn("github")}
            >
              <Image src={GitHubIcon} alt="" />
              Entrar com GitHub
            </button>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel className="border-0 bg-transparent p-0 hover:bg-transparent hover:text-gray-100">
              Cancel
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
