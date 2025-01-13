"use client";

import dayjs from "dayjs";
import { useSession } from "next-auth/react";

import { Avatar } from "@/components/Avatar";

export function AsideProfile() {
  const { data: session } = useSession();

  return (
    <div>
      <div className="flex flex-col items-center gap-5">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-vertical">
          <Avatar image={session?.user.avatar_url} size="lg" />
        </div>

        <div className="space-y-0">
          <h2 className="text-center text-xl font-bold">
            {session?.user.name}
          </h2>

          {session?.user.createdAt && (
            <h3 className="text-center text-sm text-gray-400">
              membro desde {dayjs(session?.user.createdAt).get("year")}
            </h3>
          )}
        </div>
      </div>
    </div>
  );
}
