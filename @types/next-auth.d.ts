import "next-auth";

declare module "next-auth" {
  export interface User {
    id: string;
    name: string;
    email: string;
    avatar_url: string;
    createdAt: Date | null;
  }

  interface Session {
    user: User;
  }
}
