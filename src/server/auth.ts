import type { GetServerSidePropsContext } from "next";
import {
  getServerSession,
  type NextAuthOptions,
  type DefaultSession,
  type TokenSet,
} from "next-auth";
import { type DefaultJWT } from "next-auth/jwt";
import GitHubProvider from "next-auth/providers/github";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { env } from "../env.mjs";
import { prisma } from "./db";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    access_token: string;
    expires_at: number;
    refresh_token: string;
    error?: "RefreshAccessTokenError";
  }
}

export const authOptions: NextAuthOptions = {
  secret: env.NEXTAUTH_SECRET,
  useSecureCookies: env.NODE_ENV === "production",
  // session: {
  //   strategy: "jwt",
  // },
  callbacks: {
    session({ session, user, token }) {
      console.log("session", session, user, token);
      if (session.user.id) {
        session.user.id = user.id;
      }
      return session;
    },
    // @ts-ignore
    async jwt({ token, account }) {
      console.log("jwt", token, account);
      if (account) {
        return {
          access_token: account.access_token,
          expires_at: Date.now() + (account.expires_at ?? 0) * 1000,
          refresh_token: account.refresh_token,
        };
      } else if (Date.now() < token.expires_at) {
        return token;
      } else {
        try {
          const response = await fetch(
            "https://github.com/login/oauth/access_token",
            {
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
              },
              body: JSON.stringify({
                client_id: env.GH_CLIENT_ID,
                client_secret: env.GH_CLIENT_SECRET,
                refresh_token: token.refresh_token,
                grant_type: "refresh_token",
              }),
              method: "POST",
            }
          );

          const tokens: TokenSet = await response.json();

          if (!response.ok) throw tokens;

          return {
            access_token: tokens.access_token,
            expires_at: Date.now() + (tokens.expires_at ?? 0) * 1000,
            refresh_token: tokens.refresh_token ?? token.refresh_token,
          };
        } catch (error) {
          console.error("Error refreshing access token", error);
          return { ...token, error: "RefreshAccessTokenError" as const };
        }
      }
    },
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    GitHubProvider({
      clientId: env.GH_CLIENT_ID,
      clientSecret: env.GH_CLIENT_SECRET,
      authorization: {
        params: {
          scope:
            "repo:status,repo_deployment,write:repo_hook,admin:org,notifications,read:user,project,workflow",
        },
      },
    }),
  ],
};

export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
