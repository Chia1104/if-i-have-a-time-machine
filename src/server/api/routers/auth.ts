import { createTRPCRouter, protectedProcedure } from "../trpc";

export const authRouter = createTRPCRouter({
  getAccessToken: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.account.findUnique({
      where: {
        userId: ctx.session.user.id,
      },
      select: {
        access_token: true,
      },
    });
  }),
  getRefreshToken: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.account.findUnique({
      where: {
        userId: ctx.session.user.id,
      },
      select: {
        refresh_token: true,
      },
    });
  }),
});
