"use client";

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { MagnifyingGlass } from "phosphor-react";
import { useState } from "react";

import { api } from "@/lib/axios";

import { Badge } from "@/components/Badge";
import { Header } from "@/components/Header";
import { RatingStars } from "@/components/RatingStars";
import { Skeleton } from "@/components/ui/skeleton";

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
  const [search, setSearch] = useState("");
  const [isCategorySelected, setIsCategorySelected] = useState<string | null>(
    null,
  );

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
                      className="flex gap-5 rounded-md bg-gray-700 px-5 py-4"
                    >
                      <Image
                        className="w-24 rounded-md"
                        src="https://m.media-amazon.com/images/I/91M9xPIf10L._SY466_.jpg"
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
    </>
  );
}
