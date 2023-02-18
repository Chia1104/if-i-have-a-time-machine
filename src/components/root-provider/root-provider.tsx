import { SessionProvider } from "next-auth/react";
import { type FC, type ReactNode } from "react";
import { type Session } from "next-auth";
import { ThemeProvider } from "next-themes";

const RootProvider: FC<{ session: Session | null; children: ReactNode }> = ({
  session,
  children,
}) => {
  return (
    <SessionProvider session={session}>
      <ThemeProvider enableSystem={true} attribute="class">
        {children}
      </ThemeProvider>
    </SessionProvider>
  );
};

export default RootProvider;
