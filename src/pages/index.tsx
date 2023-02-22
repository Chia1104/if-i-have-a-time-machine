import { type NextPage, type GetServerSideProps } from "next";
import Head from "next/head";
import { ProjectList } from "@/components";
import githubClient from "@/helpers/gql/github.client";
import {
  GET_REPOS,
  type GetReposRequest,
  type GetReposResponse,
} from "@/helpers/gql/query";
import { getServerAuthSession } from "@/server/auth";
import { type Session } from "next-auth";

interface Props {
  session?: Session | null;
  initialData?: GetReposResponse | null;
}

export const getServerSideProps: GetServerSideProps<Props> = async (
  context
) => {
  const session = await getServerAuthSession(context);
  if (!session || session.error) {
    return {
      props: {},
      redirect: {
        destination: "/login",
      },
    };
  }
  // try {
  //   const data = await githubClient.request<GetReposResponse, GetReposRequest>(
  //     GET_REPOS,
  //     {
  //       owner: session?.user?.name ?? "",
  //       limit: 10,
  //       sort: "CREATED_AT",
  //     },
  //     {
  //       Authorization: `Bearer ${session?.accessToken}`,
  //     }
  //   );
  //   return {
  //     props: {
  //       session,
  //       initialData: data,
  //     },
  //   };
  // } catch (error:
  //   | any
  //   | {
  //       response: {
  //         message: string;
  //         status: number;
  //       };
  //     }) {
  //   if (error.response.status === 401) {
  //     return {
  //       props: {},
  //       redirect: {
  //         destination: "/login",
  //       },
  //     };
  //   }
  // }
  return {
    props: {
      initialData: null,
    },
  };
};

const Home: NextPage<Props> = () => {
  return (
    <div className="ctw-component-container main flex flex-col items-start gap-5 pt-28">
      <h2 className="text-3xl font-bold">Tracking</h2>
      <div className="flex w-full flex-col gap-y-5">
        Here will be the tracking section
      </div>
      <h2 className="text-3xl font-bold">Projects</h2>
      <div className="flex w-full flex-col gap-y-5">
        <ProjectList />
      </div>
    </div>
  );
};

export default Home;
