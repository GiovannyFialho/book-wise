import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const { bookId } = await request.json();

  const book = await prisma.book.findUnique({
    where: {
      id: bookId,
    },
    include: {
      categories: {
        include: {
          category: true,
        },
      },
      ratings: {
        include: {
          user: true,
        },
      },
    },
  });

  const booksAvgRating = await prisma.rating.groupBy({
    by: ["book_id"],
    where: {
      book_id: bookId,
    },
    _avg: {
      rate: true,
    },
  });

  const bookWithAverageRating = {
    ...book,
    avgRating: booksAvgRating[0]?._avg.rate ?? 0,
  };

  return NextResponse.json({ book: bookWithAverageRating }, { status: 200 });
}
