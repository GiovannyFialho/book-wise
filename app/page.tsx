import Image from "next/image";

import Logo from "@/assets/book-wise-logo.png";
import GitHubIcon from "@/assets/icons/github-icon.svg";
import GoogleIcon from "@/assets/icons/google-icon.svg";
import RocketIcon from "@/assets/icons/rocket-icon.svg";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col p-5 md:flex-row">
      <div className="hidden w-[40%] min-w-[350px] flex-col items-center justify-center rounded-lg bg-[url('/images/cover-signIn.png')] bg-cover bg-center md:flex">
        <Image src={Logo} alt="Book Wise" />
      </div>

      <div className="flex flex-1 flex-col items-center justify-center">
        <div className="flex w-full max-w-[372px] flex-col gap-10">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold">Boas vindas!</h1>

            <h2 className="text-base font-normal text-gray-200">
              Faça seu login ou acesse como visitante.
            </h2>
          </div>

          <div className="flex flex-col gap-4">
            <button
              type="button"
              className="flex items-center gap-5 rounded-lg bg-gray-600 px-6 py-5 transition-all duration-300 hover:bg-gray-700"
            >
              <Image src={GoogleIcon} alt="" />
              Entrar com Google
            </button>

            <button
              type="button"
              className="flex items-center gap-5 rounded-lg bg-gray-600 px-6 py-5 transition-all duration-300 hover:bg-gray-700"
            >
              <Image src={GitHubIcon} alt="" />
              Entrar com GitHub
            </button>

            <button
              type="button"
              className="flex items-center gap-5 rounded-lg bg-gray-600 px-6 py-5 transition-all duration-300 hover:bg-gray-700"
            >
              <Image src={RocketIcon} alt="" />
              Acessar como visitante
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
