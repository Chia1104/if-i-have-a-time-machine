import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { api } from "@/utils";
import "../styles/globals.css";
import { RootProvider, PageTransition, MainNav } from "@/components";
import Head from "next/head";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <RootProvider session={session}>
      <Head>
        <title>IIHTM</title>
        <meta name="description" content="IIHTM" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MainNav />
      <PageTransition>
        <Component {...pageProps} />
      </PageTransition>
    </RootProvider>
  );
};

export default api.withTRPC(MyApp);
