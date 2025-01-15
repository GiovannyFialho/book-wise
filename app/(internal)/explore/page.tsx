import { Metadata } from "next";

import { ExploreContent } from "@/components/ExploreContent";

export const metadata: Metadata = {
  title: "BookWise | Explorar",
};

export default function Explore() {
  return (
    <main className="mt-14 w-full">
      <ExploreContent />
    </main>
  );
}
