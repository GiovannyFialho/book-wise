import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) return new NextResponse(null, { status: 401 });

  const bodySchema = z.object({
    userId: z.string(),
    description: z.string().max(450),
    rate: z.number().min(1).max(5),
  });

  try {
    const bookId = request.nextUrl.pathname.split("/").at(-2);

    if (!bookId) {
      return NextResponse.json(
        { error: "Book ID is missing" },
        { status: 400 },
      );
    }

    const { userId, description, rate } = bodySchema.parse(
      await request.json(),
    );

    const userAlreadyRated = await prisma.rating.findFirst({
      where: {
        user_id: userId,
        book_id: bookId,
      },
    });

    if (userAlreadyRated) {
      return NextResponse.json(
        { error: "You already rated this book", code: "ALREADY_RATED" },
        { status: 400 },
      );
    }

    await prisma.rating.create({
      data: {
        book_id: bookId,
        description,
        rate,
        user_id: userId,
      },
    });

    return new NextResponse(null, { status: 201 });
  } catch (error) {
    console.error(error);

    return new NextResponse(null, { status: 400 });
  }
}
