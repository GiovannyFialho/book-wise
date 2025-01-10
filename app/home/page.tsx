"use client";

import { useSession } from "next-auth/react";

export default function Home() {
  const session = useSession();

  console.log({ session });

  return (
    <div>
      <h1>
        Hello, {session.data?.user?.name ? session.data?.user.name : "World"}
      </h1>
    </div>
  );
}
