import { Metadata } from "next";

import { AsideProfile } from "@/components/AsideProfile";
import { Header } from "@/components/Header";

export const metadata: Metadata = {
  title: "BookWise | Perfil",
};

export default function Profile() {
  return (
    <main className="mt-14 flex flex-1 gap-16">
      <div className="flex flex-1">
        <Header title="Perfil" page="profile" />
      </div>

      <aside className="w-full max-w-[300px] border-l border-gray-700">
        <AsideProfile />
      </aside>
    </main>
  );
}
