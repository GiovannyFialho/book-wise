"use client";

import { ChartLineUp } from "phosphor-react";

interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  return (
    <header>
      <ChartLineUp size={32} className="text-green-100" />

      <h1 className="text-2xl font-bold">{title}</h1>
    </header>
  );
}
