import { type NextPage, type GetServerSideProps } from "next";
import Head from "next/head";
import { ProjectList } from "@/components";
import githubClient from "@/helpers/gql/github.client";
import {
  GET_REPOS,
  GetReposRequest,
  GetReposResponse,
} from "@/helpers/gql/query";
import { getServerAuthSession } from "@/server/auth";

interface Props {
  initialData?: GetReposResponse | null;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerAuthSession(context);
  try {
    const data = await githubClient.request<GetReposResponse, GetReposRequest>(
      GET_REPOS,
      {
        owner: session?.user?.name ?? "",
        limit: 10,
        sort: "CREATED_AT",
      },
      {
        Authorization: `Bearer ${session?.accessToken}`,
      }
    );
    return {
      props: {
        initialData: data,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      props: {
        initialData: null,
      },
    };
  }
};

const Home: NextPage<Props> = ({ initialData }) => {
  return (
    <div className="ctw-component-container main gap-5 pt-20">
      <Head>
        <title>IIHTM</title>
        <meta name="description" content="IIHTM" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h2 className="text-2xl font-bold">The project is under development.</h2>
      <div className="flex flex-col gap-5">
        <ProjectList initialData={initialData} />
        <p>
          If you want to help, please contact me by{" "}
          <a href="mailto:yuyuchia7423@gmail.com">Email</a>
        </p>
      </div>
    </div>
  );
};

export default Home;
