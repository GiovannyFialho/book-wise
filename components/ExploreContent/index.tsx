"use client";

import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { MagnifyingGlass } from "phosphor-react";
import { useState } from "react";

import { api } from "@/lib/axios";

import { handleSignIn } from "@/components/AuthOptionButtons";
import { Badge } from "@/components/Badge";
import { EvaluationPanel } from "@/components/EvaluationPanel";
import { Header } from "@/components/Header";
import { RatingStars } from "@/components/RatingStars";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Sheet } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";

import GitHubIcon from "@/assets/icons/github-icon.svg";
import GoogleIcon from "@/assets/icons/google-icon.svg";

interface SelectedBook {
  id: string | null;
  status: boolean;
}

interface CategoriesData {
  categories: {
    id: string;
    name: string;
  }[];
}

interface BooksData {
  books: {
    id: string;
    name: string;
    author: string;
    summary: string;
    cover_url: string;
    total_pages: number;
    created_at: Date;
    ratings: number;
    avgRating: number;
    alreadyRead: boolean;
  }[];
}

export function ExploreContent() {
  const { status: sessionStatus } = useSession();

  const [search, setSearch] = useState("");
  const [isCategorySelected, setIsCategorySelected] = useState<string | null>(
    null,
  );
  const [bookSelected, setBookSelected] = useState<SelectedBook>({
    id: null,
    status: false,
  });
  const [authDiagloOpen, setAuthDiagloOpen] = useState(false);

  const { data: categoriesData, isLoading: categoriesLoading } =
    useQuery<CategoriesData>({
      queryKey: ["categories"],
      queryFn: async () => {
        const response = await api.get("/books/categories");

        return response.data;
      },
    });

  const { data: booksData, isLoading: booksLoading } = useQuery<BooksData>({
    queryKey: ["books", isCategorySelected],
    queryFn: async () => {
      const response = await api.get("/books", {
        params: {
          category: isCategorySelected,
        },
      });

      return response.data;
    },
  });

  const filteredBooks = booksData?.books?.filter((book) => {
    return (
      book.name.toLowerCase().includes(search.toLowerCase()) ||
      book.author.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <>
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
        <Header title="Explorar" page="explore" />

        <div className="flex min-h-12 w-full max-w-80 items-center gap-2 rounded-md border border-gray-500 px-5 py-3">
          <input
            type="text"
            placeholder="Buscar livro avaliado"
            className="w-full bg-transparent"
            onChange={({ target }) => setSearch(target.value)}
          />

          <MagnifyingGlass size={20} className="text-gray-500" />
        </div>
      </div>

      <div className="relative mt-10 h-9">
        {categoriesLoading ? (
          <div className="flex items-center gap-3">
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton
                key={index}
                className="h-9 min-w-20 rounded-full bg-purple-200"
              />
            ))}
          </div>
        ) : (
          <div className="no-scrollbar absolute flex w-full gap-3 overflow-x-auto">
            <Badge
              active={isCategorySelected === null}
              onClick={() => setIsCategorySelected(null)}
            >
              Tudo
            </Badge>

            {categoriesData?.categories.map((category) => (
              <Badge
                key={category.id}
                active={isCategorySelected === category.id}
                onClick={() => setIsCategorySelected(category.id)}
              >
                {category.name}
              </Badge>
            ))}
          </div>
        )}
      </div>

      <div className="mt-12">
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {booksLoading ? (
            <>
              {Array.from({ length: 6 }).map((_, index) => (
                <Skeleton
                  key={index}
                  className="h-44 w-full rounded-md bg-gray-500"
                />
              ))}
            </>
          ) : (
            <>
              {filteredBooks && filteredBooks?.length <= 0 ? (
                <p className="text-base text-gray-400">
                  Nenhum livro encontrado
                </p>
              ) : (
                <>
                  {filteredBooks?.map((book) => (
                    <div
                      key={book.id}
                      className={`flex cursor-pointer gap-5 rounded-md border-2 bg-gray-700 px-5 py-4 transition-all duration-300 hover:border-green-100 ${bookSelected.id === book.id ? "border-green-100" : "border-gray-700"} `}
                      onClick={() => {
                        if (sessionStatus === "unauthenticated") {
                          setAuthDiagloOpen(true);
                        }

                        if (sessionStatus === "authenticated") {
                          setBookSelected({
                            id: book.id,
                            status: true,
                          });
                        }
                      }}
                    >
                      <Image
                        className="w-24 rounded-md"
                        src={book.cover_url}
                        width={108}
                        height={152}
                        alt={book.name}
                      />

                      <div className="flex flex-col justify-between">
                        <div>
                          <h3 className="text-base font-bold">{book.name}</h3>
                          <p className="text-sm text-gray-400">{book.author}</p>
                        </div>

                        <RatingStars rate={book.avgRating} />
                      </div>
                    </div>
                  ))}
                </>
              )}
            </>
          )}
        </div>
      </div>

      <Sheet
        open={bookSelected.status}
        onOpenChange={(open) => {
          if (open) {
            setBookSelected({
              ...bookSelected,
              status: true,
            });
          } else {
            setBookSelected({
              id: null,
              status: false,
            });
          }
        }}
      >
        <EvaluationPanel id={bookSelected.id} />
      </Sheet>

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
