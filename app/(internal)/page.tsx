import { Metadata } from "next";

import { Header } from "@/components/Header";

export const metadata: Metadata = {
  title: "BookWise",
};

export default function Home() {
  return (
    <main className="mt-14 flex gap-16">
      <Header title="Início" page="home" />

      <aside></aside>
    </main>
  );
}
