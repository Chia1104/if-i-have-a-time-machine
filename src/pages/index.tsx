import { type NextPage } from "next";
import { useQuery } from "@tanstack/react-query";
import githubClient from "@/helpers/gql/github.client";
import { GET_ISSUES } from "@/helpers/gql/query";
import { useToken } from "@/hooks";
import { type FC } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { api } from "@/utils";

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
  const { status, raw } = useToken();
  const { data, isLoading, isSuccess } = useQuery(["issues"], {
    queryFn: () =>
      githubClient.request<GetIssuesResponse, GetIssuesRequest>(
        GET_ISSUES,
        {
          owner: "chia1104",
          name: "chias-web-nextjs",
          sort: "CREATED_AT",
          limit: 10,
        },
        {
          Authorization: `Bearer ${raw}`,
        }
      ),
    enabled: status === "authenticated",
  });
  return (
    <>
      {isLoading && <div>Loading...</div>}
      {isSuccess && (
        <div>
          {data.repository.issues.edges.map((issue) => (
            <div key={issue.node.id}>
              <h3>{issue.node.title}</h3>
              <p>{issue.node.body}</p>
            </div>
          ))}
        </div>
      )}
      <AuthShowcase />
    </>
  );
};

export default Home;

const AuthShowcase: FC = () => {
  const { data: sessionData } = useSession();

  const { data: secretMessage } = api.example.getSecretMessage.useQuery(
    undefined, // no input
    { enabled: sessionData?.user !== undefined }
  );

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl">
        {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
        {secretMessage && <span> - {secretMessage}</span>}
      </p>
      <button
        className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
        onClick={sessionData ? () => void signOut() : () => void signIn()}>
        {sessionData ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
};
