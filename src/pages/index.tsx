import { type NextPage } from "next";
import Head from "next/head";
// import { useQuery } from "@tanstack/react-query";
// import githubClient from "@/helpers/gql/github.client";
// import { GET_ISSUES } from "@/helpers/gql/query";
// import { type FC } from "react";
// import { useSession, signIn, signOut } from "next-auth/react";
// import { api } from "@/utils";

interface GetIssuesRequest {
  owner: string;
  name: string;
  sort: "CREATED_AT" | "UPDATED_AT" | "COMMENTS";
  limit: number;
}

interface GetIssuesResponse {
  repository: {
    issues: {
      edges: {
        node: {
          id: string;
          title: string;
          body: string;
        };
      }[];
    };
  };
}

const Home: NextPage = () => {
  // const { data: sessionData, status } = useSession();
  // const { data, isLoading, isSuccess } = useQuery(["issues"], {
  //   queryFn: () =>
  //     githubClient.request<GetIssuesResponse, GetIssuesRequest>(
  //       GET_ISSUES,
  //       {
  //         owner: "chia1104",
  //         name: "chias-web-nextjs",
  //         sort: "CREATED_AT",
  //         limit: 10,
  //       },
  //       {
  //         Authorization: `Bearer ${sessionData?.accessToken}`,
  //       }
  //     ),
  //   enabled: status === "authenticated" && !!sessionData?.accessToken,
  // });
  return (
    <div className="ctw-component-container main">
      <Head>
        <title>IIHTM</title>
        <meta name="description" content="IIHTM" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h2 className="text-2xl font-bold">The project is under development.</h2>
      <p>
        If you want to help, please contact me at{" "}
        <a href="mailto:yuyuchia7423@gmail.com">Email</a>
      </p>
    </div>
  );
};

export default Home;
