"use client";

import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import { User } from "phosphor-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function AsideProfile() {
  const { data: session } = useSession();

  return (
    <div>
      <div className="flex flex-col items-center gap-5">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-vertical">
          <Avatar className="h-20 w-20 p-1">
            <AvatarImage src={session?.user.avatar_url} alt="" />

            <AvatarFallback className="bg-gray-950">
              <User size={40} />
            </AvatarFallback>
          </Avatar>
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
