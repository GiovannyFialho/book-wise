"use client";

import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Binoculars, ChartLineUp, SignIn, User } from "phosphor-react";

import Logo from "@/assets/book-wise-logo.png";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function NavBar() {
  const pathname = usePathname();

  const { data: session, status: sessionStatus } = useSession();

  return (
    <div className="flex max-h-[800px] w-[230px] flex-col justify-between rounded-xl bg-[url('/images/background-nav.svg')] px-12 pb-6 pt-10">
      <div className="flex flex-col gap-10">
        <Link href="/">
          <Image src={Logo} alt="BookWise" />
        </Link>

        <nav className="flex flex-col gap-4">
          <Link
            href="/"
            className={`flex items-center gap-4 ${pathname !== "/" ? "text-gray-400 hover:text-gray-100" : ""}`}
            aria-label="Início"
          >
            {pathname === "/" && (
              <div className="h-[24px] w-[4px] rounded-full bg-gradient-vertical"></div>
            )}

            <div className="flex items-center gap-3">
              <ChartLineUp size={24} />
              <span className="text-base font-bold">Início</span>
            </div>
          </Link>

          <Link
            href="/explore"
            className={`flex items-center gap-4 ${pathname !== "/explore" ? "text-gray-400 hover:text-gray-100" : ""}`}
            aria-label="Explorar"
          >
            {pathname === "/explore" && (
              <div className="h-[24px] w-[4px] rounded-full bg-gradient-vertical"></div>
            )}

            <div className="flex items-center gap-3">
              <Binoculars size={24} />
              <span className="text-base font-bold">Explorar</span>
            </div>
          </Link>

          {sessionStatus === "authenticated" && (
            <Link
              href="/profile"
              className={`flex items-center gap-4 ${pathname !== "/profile" ? "text-gray-400 hover:text-gray-100" : ""}`}
              aria-label="Perfil"
            >
              {pathname === "/profile" && (
                <div className="h-[24px] w-[4px] rounded-full bg-gradient-vertical"></div>
              )}

              <div className="flex items-center gap-3">
                <User size={24} />
                <span className="text-base font-bold">Perfil</span>
              </div>
            </Link>
          )}
        </nav>
      </div>

      <div className="mt-auto">
        {sessionStatus === "unauthenticated" ? (
          <Link
            href="/sign-in"
            className="flex items-center gap-3 text-base font-bold text-gray-200"
            aria-label="Login"
          >
            Fazer login
            <SignIn size={24} className="text-green-100" />
          </Link>
        ) : (
          <button
            type="button"
            onClick={() => signOut()}
            className="flex items-center gap-3"
          >
            <div className="flex items-center gap-3">
              <Avatar className="h-auto max-w-8">
                <AvatarImage src={session?.user.avatar_url} alt="" />

                <AvatarFallback>
                  <div className="flex h-8 w-8 items-center justify-center rounded-full border bg-gray-950">
                    <User />
                  </div>
                </AvatarFallback>
              </Avatar>

              <p className="text-sm">{session?.user.name.split(" ")[0]}</p>
            </div>

            <SignIn size={24} className="text-[#F75A68]" />
          </button>
        )}
      </div>
    </div>
  );
}
