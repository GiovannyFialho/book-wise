"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Binoculars, ChartLineUp } from "phosphor-react";

import Logo from "@/assets/book-wise-logo.png";

export function NavBar() {
  const pathname = usePathname();

  return (
    <div className="w-[230px] rounded-xl bg-[url('/images/background-nav.svg')] px-12 pb-6 pt-10">
      <Link href="/">
        <Image src={Logo} alt="BookWise" />
      </Link>

      <nav className="mt-10 flex flex-col gap-4">
        <Link
          href="/"
          className={`flex items-center gap-3 ${pathname !== "/" ? "text-gray-400 hover:text-gray-100" : ""}`}
          aria-label="Início"
        >
          <ChartLineUp size={24} />
          <span className="text-base font-bold">Início</span>
        </Link>

        <Link
          href="/explore"
          className={`flex items-center gap-3 ${pathname !== "/explore" ? "text-gray-400 hover:text-gray-100" : ""}`}
          aria-label="Explorar"
        >
          <Binoculars size={24} />
          <span className="text-base font-bold">Explorar</span>
        </Link>
      </nav>
    </div>
  );
}
