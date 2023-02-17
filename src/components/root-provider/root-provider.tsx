import { SessionProvider } from "next-auth/react";
import { type FC, type ReactNode } from "react";
import { type Session } from "next-auth";

const RootProvider: FC<{ session: Session | null; children: ReactNode }> = ({
  session,
  children,
}) => {
  return <SessionProvider session={session}>{children}</SessionProvider>;
};

export default RootProvider;
