import NextAuth, { NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider, { GoogleProfile } from "next-auth/providers/google";

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
          username: profile.email.split("@")[0],
          avatar_url: profile.picture,
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
          username: profile.login,
          avatar_url: profile.avatar_url,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, account, user }) {
      if (account && user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.username = user.username;
        token.avatar_url = user.avatar_url;
      }

      return token;
    },

    async session({ session, token }) {
      session.user = {
        id: token.id as string,
        name: token.name as string,
        email: token.email as string,
        username: token.username as string,
        avatar_url: token.avatar_url as string,
      };

      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
