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
    <div className="ctw-component-container main gap-5 pt-20">
      <h2 className="text-2xl font-bold">The project is under development.</h2>
      <div className="flex flex-col gap-5">
        <ProjectList />
        <p>
          If you want to help, please contact me by{" "}
          <a href="mailto:yuyuchia7423@gmail.com">Email</a>
        </p>
      </div>
    </div>
  );
};

export default Home;
