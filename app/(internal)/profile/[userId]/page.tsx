import { Metadata } from "next";

import { Header } from "@/components/Header";
import { ProfileContent } from "@/components/ProfileContent";

export const metadata: Metadata = {
  title: "BookWise | Perfil",
};

interface ProfileProps {
  params: Promise<{ userId: string }>;
}

export default async function Profile({ params }: ProfileProps) {
  const userId = (await params).userId;

  return (
    <main className="mt-14 w-full">
      <Header title="Perfil" page="profile" />

      <ProfileContent userId={userId} />
    </main>
  );
}
