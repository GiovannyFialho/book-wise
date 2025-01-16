"use client";

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { CaretRight } from "phosphor-react";

import { api } from "@/lib/axios";

import { RatingStars } from "@/components/RatingStars";
import { Skeleton } from "@/components/ui/skeleton";

export interface Rating {
  id: string;
  rate: number;
  description: string;
  created_at: string;
  book_id: string;
  user_id: string;
}

interface PopularBooksData {
  booksWithAvgRating: {
    id: string;
    name: string;
    author: string;
    summary: string;
    cover_url: string;
    total_pages: number;
    created_at: Date;
    ratings: Rating[];
    avgRating: number;
  }[];
}

export function PopularBooks() {
  const { data: trendingBooks, isLoading } = useQuery<PopularBooksData>({
    queryKey: ["popular"],
    queryFn: async () => {
      const response = await api.get("/books/popular");

      return response.data;
    },
  });

  return (
    <aside className="h-auto w-full max-w-[325px]">
      <div className="sticky top-0 pt-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm">Livros populares</h2>

          <Link
            href="/explore"
            className="flex items-center gap-2 text-sm font-bold text-purple-100"
          >
            Ver todos
            <CaretRight size={16} className="text-purple-100" />
          </Link>
        </div>

        <div className="flex flex-col gap-3">
          {isLoading ? (
            <>
              {Array.from({ length: 3 }).map((_, index) => (
                <Skeleton
                  key={index}
                  className="h-32 w-full rounded-md bg-gray-500"
                />
              ))}
            </>
          ) : (
            <>
              {trendingBooks && trendingBooks?.booksWithAvgRating.length > 0 ? (
                <>
                  {trendingBooks?.booksWithAvgRating.map((book) => (
                    <div
                      key={book.id}
                      className="flex min-h-28 gap-5 rounded-lg bg-gray-700 p-4"
                    >
                      <div className="min-w-16 overflow-hidden rounded-lg">
                        <Image
                          className="w-full"
                          src={book.cover_url}
                          width={64}
                          height={94}
                          alt={book.name}
                        />
                      </div>

                      <div className="flex flex-col justify-between">
                        <div>
                          <h3 className="line-clamp-2 text-base font-bold">
                            {book.name}
                          </h3>
                          <p className="text-sm text-gray-400">{book.author}</p>
                        </div>

                        <RatingStars rate={book.avgRating} />
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <p className="text-sm text-gray-400">Nenhum livro encontrado</p>
              )}
            </>
          )}
        </div>
      </div>
    </aside>
  );
}
