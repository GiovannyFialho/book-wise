import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(request: NextRequest) {
  const categoryId = request.nextUrl.searchParams.get("category") ?? "";

  const books = await prisma.book.findMany({
    where: categoryId
      ? {
          categories: {
            some: {
              categoryId,
            },
          },
        }
      : {},
    include: {
      ratings: true,
    },
  });

  const booksAverageRating = await prisma.rating.groupBy({
    by: ["book_id"],
    _avg: {
      rate: true,
    },
  });

  let userBooksIds: string[] = [];

  const session = await getServerSession(authOptions);

  if (session) {
    const userBooks = await prisma.book.findMany({
      where: {
        ratings: {
          some: {
            user_id: String(session?.user?.id),
          },
        },
      },
    });

    userBooksIds = userBooks?.map((x) => x?.id);
  }

  const booksWithAverageRating = books.map((book) => {
    const bookAvgRating = booksAverageRating.find(
      (avgRating) => avgRating.book_id === book.id,
    );
    const { ratings, ...bookInfo } = book;

    return {
      ...bookInfo,
      ratings: ratings.length,
      avgRating: bookAvgRating?._avg.rate,
      alreadyRead: userBooksIds.includes(book.id),
    };
  });

  return NextResponse.json({ books: booksWithAverageRating }, { status: 200 });
}
