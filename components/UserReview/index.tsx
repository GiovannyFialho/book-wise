"use client";

import dayjs from "dayjs";
import Image from "next/image";
import { FaRegStar, FaStar } from "react-icons/fa6";

import { Avatar } from "@/components/Avatar";

interface UserReviewProps {
  data: {
    author: {
      avatar: string;
      name: string;
      rate: number;
      createdAt: Date;
    };
    book: {
      cover: string;
      title: string;
      author: string;
      summary: string;
    };
  };
}

export function UserReview({ data }: UserReviewProps) {
  return (
    <article className="flex w-full flex-col gap-8 rounded-lg bg-gray-700 p-6">
      <header className="flex justify-between gap-4">
        <div className="flex items-center gap-4">
          <Avatar image={data.author.avatar} size="sm" />

          <div className="flex flex-col">
            <h3 className="text-base">{data.author.name}</h3>
            <p className="text-sm text-gray-400">
              {dayjs(data.author.createdAt).get("year")}
            </p>
          </div>
        </div>

        <div className="flex gap-1">
          {Array.from({ length: 5 }, (_, index) => {
            if (index + 1 <= data.author.rate) {
              return (
                <FaStar key={index} className="text-purple-100" size={24} />
              );
            } else {
              return (
                <FaRegStar key={index} className="text-purple-100" size={24} />
              );
            }
          })}
        </div>
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
            {data.book.summary}
          </p>
        </div>
      </main>
    </article>
  );
}
