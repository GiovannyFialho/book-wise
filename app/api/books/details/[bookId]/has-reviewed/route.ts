import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json(
      { error: "There's no session active", code: "USER_ID_MISSING" },
      { status: 400 },
    );
  }

  const bookId = request.nextUrl.pathname.split("/").at(-2);

  if (!bookId) {
    return NextResponse.json(
      { error: "The book ID is missing", code: "BOOK_ID_MISSING" },
      { status: 400 },
    );
  }

  const userId = request.nextUrl.searchParams.get("userId") ?? "";

  if (!userId) {
    return NextResponse.json(
      { error: "The user ID is missing", code: "USER_ID_MISSING" },
      { status: 400 },
    );
  }

  try {
    const userAlreadyRated = await prisma.rating.findFirst({
      where: {
        user_id: userId,
        book_id: bookId,
      },
    });

    return NextResponse.json({ hasRated: !!userAlreadyRated }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        error: "An unexpected error occurred while checking the rating",
        code: "CHECK_RATING_ERROR",
        details: error,
      },
      { status: 500 },
    );
  }
}
