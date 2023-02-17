import { SessionProvider } from "next-auth/react";
import { type FC, type ReactNode } from "react";
import { type Session } from "next-auth";
import { TokenProvider } from "./token-provider";

const RootProvider: FC<{ session: Session | null; children: ReactNode }> = ({
  session,
  children,
}) => {
  return (
    <SessionProvider session={session}>
      <TokenProvider>{children}</TokenProvider>
    </SessionProvider>
  );
};

export default RootProvider;
