import { Metadata } from "next";

import { Header } from "@/components/Header";

export const metadata: Metadata = {
  title: "BookWise | Explorar",
};

export default function Explore() {
  return (
    <main className="mt-14 flex gap-16">
      <Header title="Explorar" page="explore" />

      <aside></aside>
    </main>
  );
}
