"use client";

import { type OAuthProviderType } from "next-auth/providers/oauth-types";
import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

import GitHubIcon from "@/assets/icons/github-icon.svg";
import GoogleIcon from "@/assets/icons/google-icon.svg";
import RocketIcon from "@/assets/icons/rocket-icon.svg";

export async function handleSignIn(provider: OAuthProviderType) {
  const result = await signIn(provider, { callbackUrl: "/" });

  if (result?.error) {
    console.error("Erro ao autenticar:", result.error);
    alert("Erro ao autenticar. Tente novamente.");
  }
}

export function AuthOptionButtons() {
  return (
    <div className="flex flex-col gap-4">
      <button
        type="button"
        className="flex items-center gap-5 rounded-lg bg-gray-600 px-6 py-5 transition-all duration-300 hover:bg-gray-700"
        onClick={() => handleSignIn("google")}
      >
        <Image src={GoogleIcon} alt="" />
        Entrar com Google
      </button>

      <button
        type="button"
        className="flex items-center gap-5 rounded-lg bg-gray-600 px-6 py-5 transition-all duration-300 hover:bg-gray-700"
        onClick={() => handleSignIn("github")}
      >
        <Image src={GitHubIcon} alt="" />
        Entrar com GitHub
      </button>

      <Link
        href="/"
        className="flex items-center gap-5 rounded-lg bg-gray-600 px-6 py-5 transition-all duration-300 hover:bg-gray-700"
      >
        <Image src={RocketIcon} alt="" />
        Acessar como visitante
      </Link>
    </div>
  );
}
