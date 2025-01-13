import { Metadata } from "next";

import { Header } from "@/components/Header";
import { RatingContainer } from "@/components/RatingContainer";

export const metadata: Metadata = {
  title: "BookWise",
};

export default function Home() {
  return (
    <main className="mt-14 w-full">
      <Header title="Início" page="home" />

      <div className="mt-10 flex flex-1 gap-16">
        <section className="w-full">
          <h2 className="mb-4 text-sm">Avaliações mais recentes</h2>

          <RatingContainer />
        </section>

        <aside className="w-full max-w-[300px] border-l border-gray-700"></aside>
      </div>
    </main>
  );
}
