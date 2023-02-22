import type { NextPage } from "next";
import { signIn } from "next-auth/react";
import Head from "next/head";

const Login: NextPage = () => {
  return (
    <div className="ctw-component-container main gap-5 pt-20">
      <Head>
        <title>Login | IIHTM</title>
        <meta name="description" content="Login | IIHTM" />
      </Head>
      <button
        onClick={() =>
          signIn("github", {
            redirect: true,
            callbackUrl: "/",
          })
        }>
        Sign in
      </button>
    </div>
  );
};

export default Login;
