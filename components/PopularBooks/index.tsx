"use client";

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { CaretRight } from "phosphor-react";
import { FaRegStar, FaRegStarHalfStroke, FaStar } from "react-icons/fa6";

import { api } from "@/lib/axios";

interface PopularBooksData {
  booksWithAvgRating: {
    id: string;
    name: string;
    author: string;
    summary: string;
    cover_url: string;
    total_pages: number;
    created_at: Date;
    ratings: {
      id: string;
      rate: number;
      description: string;
      created_at: string;
      book_id: string;
      user_id: string;
    }[];
    avgRating: number;
  }[];
}

export function PopularBooks() {
  const { data: trendingBooks } = useQuery<PopularBooksData>({
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
          {trendingBooks?.booksWithAvgRating.map((book) => (
            <div
              key={book.id}
              className="flex min-h-28 gap-5 rounded-lg bg-gray-700 p-4"
            >
              <div className="min-w-16 overflow-hidden rounded-lg">
                <Image
                  className="w-full"
                  src="https://m.media-amazon.com/images/I/91M9xPIf10L._SY466_.jpg"
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

                <div className="flex gap-1">
                  {Array.from({ length: 5 }, (_, index) => {
                    if (index + 1 <= Math.floor(book.avgRating)) {
                      return (
                        <FaStar
                          key={index}
                          className="text-purple-100"
                          size={24}
                        />
                      );
                    } else if (
                      index < Math.ceil(book.avgRating) &&
                      book.avgRating % 1 !== 0
                    ) {
                      return (
                        <FaRegStarHalfStroke
                          key={index}
                          className="text-purple-100"
                          size={24}
                        />
                      );
                    } else {
                      return (
                        <FaRegStar
                          key={index}
                          className="text-purple-100"
                          size={24}
                        />
                      );
                    }
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
