"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";

interface BadgeProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  children: ReactNode;
}

export function Badge({ children, active, className, ...props }: BadgeProps) {
  return (
    <button
      type="button"
      className={`h-9 w-max cursor-pointer rounded-full border px-4 py-1 text-base transition-all duration-300 ${
        active
          ? "border-purple-200 bg-purple-200 text-gray-100"
          : "border-purple-100 bg-gray-800 text-purple-100 hover:border-purple-200 hover:bg-purple-200 hover:text-gray-100"
      } ${className ?? ""}`}
      {...props}
    >
      {children}
    </button>
  );
}
