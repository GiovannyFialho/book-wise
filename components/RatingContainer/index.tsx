"use client";

import { useQuery } from "@tanstack/react-query";

import { UserReview } from "@/components/UserReview";

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
  const { data: ratingList } = useQuery<RatingListProps>({
    queryKey: ["rating-list"],
    queryFn: async () => {
      const response = await api.get("/ratings");

      return response.data;
    },
  });

  return (
    <div className="no-scrollbar flex flex-col gap-3 overflow-auto">
      {ratingList?.ratings?.map((ratingItem) => (
        <UserReview
          key={ratingItem.id}
          data={{
            author: {
              avatar: ratingItem.user.avatar_url,
              name: ratingItem.user.name,
              rate: ratingItem.rate,
              createdAt: ratingItem.user.created_at,
            },
            book: {
              author: ratingItem.book.author,
              cover: ratingItem.book.cover_url,
              summary: ratingItem.book.summary,
              title: ratingItem.book.name,
            },
          }}
        />
      ))}
    </div>
  );
}
