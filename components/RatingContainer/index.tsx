"use client";

import { useQuery } from "@tanstack/react-query";

import { UserReview } from "@/components/UserReview";
import { Skeleton } from "@/components/ui/skeleton";

import { api } from "@/lib/axios";

interface RatingListProps {
  ratings: {
    id: string;
    rate: number;
    description: string;
    created_at: Date;
    book_id: string;
    user_id: string;
    book: {
      id: string;
      name: string;
      author: string;
      summary: string;
      cover_url: string;
      total_pages: number;
      created_at: Date;
    };
    user: {
      id: string;
      name: string;
      email: string;
      avatar_url: string;
      created_at: Date;
    };
  }[];
}

export function RatingContainer() {
  const { data: ratingList, isLoading: ratingListLoading } =
    useQuery<RatingListProps>({
      queryKey: ["rating-latest"],
      queryFn: async () => {
        const response = await api.get("/ratings/latest");

        return response.data;
      },
    });

  return (
    <div className="no-scrollbar flex flex-col gap-3 overflow-auto">
      {ratingListLoading ? (
        <>
          {Array.from({ length: 2 }).map((_, index) => (
            <Skeleton
              key={index}
              className="h-72 w-full rounded-md bg-gray-500"
            />
          ))}
        </>
      ) : (
        <>
          {ratingList && ratingList.ratings.length > 0 ? (
            <>
              {ratingList?.ratings?.map((ratingItem) => (
                <UserReview
                  key={ratingItem.id}
                  data={{
                    author: {
                      id: ratingItem.user.id,
                      avatar: ratingItem.user.avatar_url,
                      name: ratingItem.user.name,
                      rate: ratingItem.rate,
                      createdAt: ratingItem.created_at,
                    },
                    book: {
                      author: ratingItem.book.author,
                      cover:
                        "https://m.media-amazon.com/images/I/91M9xPIf10L._SY466_.jpg",
                      summary: ratingItem.book.summary,
                      title: ratingItem.book.name,
                    },
                  }}
                />
              ))}
            </>
          ) : (
            <p className="text-sm text-gray-400">
              Nenhuma avaliação até o momento
            </p>
          )}
        </>
      )}
    </div>
  );
}
