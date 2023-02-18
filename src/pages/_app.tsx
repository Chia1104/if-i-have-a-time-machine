import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { api } from "@/utils";
import "../styles/globals.css";
import { RootProvider, PageTransition, MainNav } from "@/components";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <RootProvider session={session}>
      <PageTransition>
        <MainNav />
        <Component {...pageProps} />
      </PageTransition>
    </RootProvider>
  );
};

export default api.withTRPC(MyApp);
