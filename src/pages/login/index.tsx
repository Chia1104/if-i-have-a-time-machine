import type { NextPage, GetServerSideProps } from "next";
import { signIn } from "next-auth/react";
import Head from "next/head";
import { getServerAuthSession } from "@/server/auth";
import { Hero, FadeIn, Image } from "@/components";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerAuthSession(context);
  if (session) {
    return {
      props: {},
      redirect: {
        destination: "/",
      },
    };
  }
  return {
    props: {},
  };
};

const Login: NextPage = () => {
  return (
    <div className="ctw-component-container main gap-5 pt-20">
      <Head>
        <title>Login | IIHTM</title>
        <meta name="description" content="Login | IIHTM" />
      </Head>
      <FadeIn className="flex w-full items-center justify-center">
        <h2 className="text-3xl font-bold">IIHTM</h2>
      </FadeIn>
      <FadeIn className="flex w-full items-center justify-center">
        <p className="text-xl text-gray-500">
          Manage your GitHub repositories with ease.
        </p>
      </FadeIn>
      <FadeIn className="flex w-full items-center justify-center" delay={0.7}>
        <Hero>
          <Image
            src="/iihtm-700.png"
            alt="logo-1"
            width={150}
            height={150}
            loading="lazy"
          />
          <button
            onClick={() =>
              signIn("github", {
                redirect: true,
                callbackUrl: "/",
              })
            }
            className="relative mt-auto mb-10 flex min-h-[50px] w-full items-center gap-2 rounded-md bg-[#24292e] px-4 py-2 text-sm font-bold text-white transition before:absolute
          hover:before:left-0 hover:before:top-0 hover:before:-z-10 hover:before:h-full hover:before:w-full hover:before:bg-gradient-to-r hover:before:from-[#A853BAFF] hover:before:to-[#2A8AF6FF] hover:before:blur-[5px]">
            <span className="i-mdi-github h-7 w-7" />
            <span>Sign in with GitHub</span>
          </button>
        </Hero>
      </FadeIn>
    </div>
  );
};

export default Login;
