import { ReactNode } from "react";

import { NavBar } from "@/components/NavBar";

interface InternalRootProps {
  children: ReactNode;
}

export default function InternalRoot({ children }: InternalRootProps) {
  return (
    <div className="flex min-h-screen gap-20 p-5">
      <NavBar />

      {children}
    </div>
  );
}
