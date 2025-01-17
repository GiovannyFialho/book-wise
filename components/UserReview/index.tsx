"use client";

import Image from "next/image";
import Link from "next/link";

import { formatDate } from "@/utils/formatData";

import { Avatar } from "@/components/Avatar";
import { RatingStars } from "@/components/RatingStars";

interface UserReviewProps {
  data: {
    author: {
      id: string;
      avatar: string;
      name: string;
      rate: number;
      createdAt: Date;
    };
    book: {
      cover: string;
      title: string;
      author: string;
      description: string;
    };
  };
}

export function UserReview({ data }: UserReviewProps) {
  return (
    <article className="flex w-full flex-col gap-8 rounded-lg bg-gray-700 p-6">
      <header className="flex justify-between gap-4">
        <Link
          href={`/profile/${data.author.id}`}
          className="flex items-center gap-4"
        >
          <Avatar image={data.author.avatar} size="sm" />

          <div className="flex flex-col">
            <h3 className="text-base">{data.author.name}</h3>
            <p className="text-sm text-gray-400">
              {formatDate(data.author.createdAt)}
            </p>
          </div>
        </Link>

        <RatingStars rate={data.author.rate} />
      </header>

      <main className="flex gap-5">
        <div className="min-w-28 overflow-hidden rounded-lg">
          <Image
            className="w-full"
            src={data.book.cover}
            width={108}
            height={152}
            alt={data.book.title}
          />
        </div>

        <div className="flex flex-col gap-5">
          <div>
            <h3 className="text-base font-bold">{data.book.title}</h3>
            <p className="text-sm text-gray-400">{data.book.author}</p>
          </div>

          <p className="text-sm font-semibold text-gray-400">
            {data.book.description}
          </p>
        </div>
      </main>
    </article>
  );
}
