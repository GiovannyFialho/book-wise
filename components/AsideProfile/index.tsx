"use client";

import dayjs from "dayjs";
import { BookmarkSimple, BookOpen, Books, UserList } from "phosphor-react";

import { Avatar } from "@/components/Avatar";
import { Skeleton } from "@/components/ui/skeleton";

export type ProfileData = {
  isLoading?: boolean;
  user: {
    avatar_url: string;
    name: string;
    member_since: string;
  };
  readPages: number;
  ratedBooks: number;
  readAuthors: number;
  mostReadCategory?: string;
};

export function AsideProfile({
  isLoading,
  user,
  readPages,
  ratedBooks,
  readAuthors,
  mostReadCategory,
}: ProfileData) {
  return (
    <div className="sticky top-5 flex flex-col items-center border-l border-gray-700 py-5">
      <div className="flex flex-col items-center gap-5">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-vertical">
          <Avatar image={user.avatar_url} size="lg" />
        </div>

        <div className="space-y-0">
          {isLoading ? (
            <Skeleton className="mb-2 h-3 w-28 bg-gray-500" />
          ) : (
            <h2 className="text-center text-xl font-bold">{user.name}</h2>
          )}

          {isLoading ? (
            <Skeleton className="h-2 w-28 bg-gray-500" />
          ) : (
            <h3 className="text-center text-sm text-gray-400">
              membro desde {dayjs(user.member_since).get("year")}
            </h3>
          )}
        </div>
      </div>

      <div className="my-8 h-1 w-8 rounded-full bg-gradient-horizontal"></div>

      <div className="flex flex-col gap-10">
        <div className="flex items-center gap-5">
          <BookOpen size={32} className="text-green-100" />

          <div>
            {isLoading ? (
              <Skeleton className="mb-2 h-4 w-28 bg-gray-500" />
            ) : (
              <h4 className="text-base font-bold">{readPages}</h4>
            )}
            <p className="text-sm">Páginas lidas</p>
          </div>
        </div>

        <div className="flex items-center gap-5">
          <Books size={32} className="text-green-100" />

          <div>
            {isLoading ? (
              <Skeleton className="mb-2 h-4 w-28 bg-gray-500" />
            ) : (
              <h4 className="text-base font-bold">{ratedBooks}</h4>
            )}
            <p className="text-sm">Livros avaliados</p>
          </div>
        </div>

        <div className="flex items-center gap-5">
          <UserList size={32} className="text-green-100" />

          <div>
            {isLoading ? (
              <Skeleton className="mb-2 h-4 w-28 bg-gray-500" />
            ) : (
              <h4 className="text-base font-bold">{readAuthors}</h4>
            )}
            <p className="text-sm">Autores lidos</p>
          </div>
        </div>

        <div className="flex items-center gap-5">
          <BookmarkSimple size={32} className="text-green-100" />

          <div>
            {isLoading ? (
              <Skeleton className="mb-2 h-4 w-28 bg-gray-500" />
            ) : (
              <h4 className="text-base font-bold">{mostReadCategory}</h4>
            )}
            <p className="text-sm">Categoria mais lida</p>
          </div>
        </div>
      </div>
    </div>
  );
}
