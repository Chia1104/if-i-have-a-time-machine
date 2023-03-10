import type { GetServerSidePropsContext } from "next";
import {
  getServerSession,
  type NextAuthOptions,
  type DefaultSession,
  type TokenSet,
  type DefaultUser,
} from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { env } from "../env.mjs";
import { prisma } from "./db";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      role: "ADMIN" | "USER";
    } & DefaultSession["user"];
    error?: "RefreshAccessTokenError";
    accessToken: string;
  }

  interface User extends DefaultUser {
    role: "ADMIN" | "USER";
  }

  interface Profile {
    login: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    access_token: string;
    expires_at: number;
    refresh_token: string;
    error?: "RefreshAccessTokenError";
  }
}

export const authOptions: NextAuthOptions = {
  useSecureCookies: env.NODE_ENV === "production",
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async signIn({ user, profile }) {
      if (!profile || !user) return false;
      user.name = profile.login;
      return true;
    },
    async session({ session, user }) {
      console.log("session", session, user);
      let accessToken = "";
      const account = await prisma.account.findUnique({
        where: { userId: user.id },
      });
      if ((account?.expires_at ?? 0) < Math.floor(Date.now() / 1000)) {
        try {
          const response = await fetch(
            "https://github.com/login/oauth/access_token",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
              },
              body: JSON.stringify({
                client_id: env.GH_CLIENT_ID,
                client_secret: env.GH_CLIENT_SECRET,
                refresh_token: account?.refresh_token,
                grant_type: "refresh_token",
              }),
            }
          );
          const tokens: TokenSet & {
            expires_in: number;
            refresh_token_expires_in: number;
          } = await response.json();

          if (!response.ok || !tokens.access_token) throw tokens;

          accessToken = tokens.access_token;

          await prisma.account.update({
            data: {
              access_token: tokens.access_token,
              expires_at: Math.floor(Date.now() / 1000 + tokens.expires_in),
              refresh_token: tokens.refresh_token ?? account?.refresh_token,
              refresh_token_expires_in: tokens.refresh_token_expires_in,
            },
            where: {
              provider_providerAccountId: {
                provider: "github",
                providerAccountId: account?.providerAccountId ?? "",
              },
            },
          });
        } catch (error) {
          console.error("Error refreshing access token", error);
          session.error = "RefreshAccessTokenError";
        }
      } else {
        accessToken = account?.access_token ?? "";
      }
      if (session.user) {
        session.user.id = user.id;
        session.user.role = user.role;
      }
      return {
        ...session,
        accessToken,
      };
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
            "repo:status repo_deployment write:repo_hook admin:org notifications read:user project workflow",
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
