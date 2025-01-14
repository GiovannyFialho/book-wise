import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getMostFrequentString } from "@/utils/getMostFrequentString";

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.pathname.split("/").at(-1);

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  const profile = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      ratings: {
        include: {
          book: {
            include: {
              categories: {
                include: {
                  category: true,
                },
              },
            },
          },
        },
        orderBy: {
          created_at: "desc",
        },
      },
    },
  });

  const readPages = profile?.ratings.reduce(
    (acc, rating) => acc + rating.book.total_pages,
    0,
  );
  const ratedBooks = profile?.ratings.length;
  const readAuthors = profile?.ratings.reduce((acc, rating) => {
    if (!acc.includes(rating.book.author)) {
      acc.push(rating.book.author);
    }

    return acc;
  }, [] as string[]);

  const categories = profile?.ratings?.flatMap((rating) =>
    rating?.book?.categories?.flatMap((category) => category?.category?.name),
  );

  const mostReadCategory = categories
    ? getMostFrequentString(categories)
    : null;

  const profileData = {
    user: {
      avatar_url: profile?.avatar_url,
      name: profile?.name,
      member_since: profile?.created_at,
    },
    ratings: profile?.ratings,
    readPages,
    ratedBooks,
    readAuthors: readAuthors?.length,
    mostReadCategory,
  };

  return NextResponse.json({ profile: profileData }, { status: 200 });
}
