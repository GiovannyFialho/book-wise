import NextAuth, { NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider, { GoogleProfile } from "next-auth/providers/google";

import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      authorization: {
        params: {
          scope:
            "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile",
        },
      },
      profile(profile: GoogleProfile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          avatar_url: profile.picture,
          createdAt: null,
        };
      },
    }),

    GitHubProvider({
      clientId: process.env.GITHUB_ID ?? "",
      clientSecret: process.env.GITHUB_SECRET ?? "",
      profile(profile) {
        return {
          id: profile.id,
          name: profile.name,
          email: profile.email,
          avatar_url: profile.avatar_url,
          createdAt: null,
        };
      },
    }),
  ],

  callbacks: {
    async signIn({ user }) {
      try {
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email || undefined },
        });

        if (!existingUser) {
          await prisma.user.create({
            data: {
              name: user.name,
              email: user.email ?? "",
              avatar_url: user.avatar_url,
            },
          });
        }

        return true;
      } catch (error) {
        console.error("Error saving user to DB:", error);

        return false;
      }
    },

    async jwt({ token, account, user }) {
      if (account && user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.avatar_url = user.avatar_url;
      }

      return token;
    },

    async session({ session, token }) {
      const user = await prisma.user.findUnique({
        where: { email: token.email! },
      });

      if (user) {
        session.user = {
          id: user.id,
          name: user.name,
          email: user.email,
          avatar_url: user.avatar_url,
          createdAt: user.created_at,
        };
      }

      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
