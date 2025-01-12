"use client";

import { Binoculars, ChartLineUp, User } from "phosphor-react";

interface HeaderProps {
  title: string;
  page: "home" | "explore" | "profile";
}

export function Header({ title, page }: HeaderProps) {
  return (
    <header className="flex gap-3">
      {page === "home" && <ChartLineUp size={32} className="text-green-100" />}

      {page === "explore" && (
        <Binoculars size={32} className="text-green-100" />
      )}

      {page === "profile" && <User size={32} className="text-green-100" />}

      <h1 className="text-2xl font-bold">{title}</h1>
    </header>
  );
}
