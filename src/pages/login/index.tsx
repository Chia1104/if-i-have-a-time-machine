import type { NextPage } from "next";
import { signIn } from "next-auth/react";

const Login: NextPage = () => {
  return (
    <div>
      <button onClick={() => signIn("github")}>Sign in</button>
    </div>
  );
};

export default Login;
