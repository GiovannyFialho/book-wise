import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function handler() {
  const session = await getServerSession(authOptions);

  if (!session) return new NextResponse(null, { status: 401 });

  const latestUserRating = await prisma.rating.findFirst({
    where: {
      user_id: String(session?.user?.id),
    },
    orderBy: {
      created_at: "desc",
    },
    include: {
      book: true,
    },
  });

  return NextResponse.json({ rating: latestUserRating }, { status: 200 });
}
