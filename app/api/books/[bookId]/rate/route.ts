import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) return new NextResponse(null, { status: 401 });

  try {
    const { bookId, userId } = await request.json();

    const bodySchema = z.object({
      description: z.string().max(450),
      rate: z.number().min(1).max(5),
    });

    const { description, rate } = bodySchema.parse(await request.json());

    const userAlreadyRated = await prisma.rating.findFirst({
      where: {
        user_id: userId,
        book_id: bookId,
      },
    });

    if (userAlreadyRated) {
      return NextResponse.json(
        { error: "You already rated this book" },
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
