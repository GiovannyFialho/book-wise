import "next-auth";

declare module "next-auth" {
  export interface User {
    id: string;
    name: string;
    email: string | null;
    avatar_url: string | null;
    createdAt: Date | null;
  }

  interface Session {
    user: User;
  }
}
