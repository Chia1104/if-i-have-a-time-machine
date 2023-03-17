import { type FC, forwardRef, useMemo, useState } from "react";
import { useInfiniteQuery, useQueries } from "@tanstack/react-query";
import githubClient from "@/helpers/gql/github.client";
import {
  GET_REPOS,
  GET_REPO_ISSUES,
  GET_REPO_DETAILS,
  type GetRepoDetailsRequest,
  type GetRepoDetailsResponse,
  type GetRepoIssuesRequest,
  type GetRepoIssuesResponse,
  type GetReposRequest,
  type GetReposResponse,
} from "@/helpers/gql/query";
import { useSession } from "next-auth/react";
import { useInfiniteScroll } from "@/hooks";
import { type Session } from "next-auth";
import Link from "next/link";
import { Modal } from "@/components";
import { useRouter } from "next/router";

interface Props {
  initialData?: GetReposResponse | null;
  session?: Session | null;
}

const ProjectLoader = () => {
  return (
    <div className="ctw-component-bg-card relative flex min-h-[140px] w-full animate-pulse flex-col rounded-lg py-2 px-4">
      <div>
        <div className="flex w-full items-center justify-between">
          <div className="h-5 w-1/2 rounded bg-gray-300" />
          <div className="h-5 w-5 rounded-full bg-gray-300" />
        </div>
        <div className="mt-3 h-3 w-1/2 rounded bg-gray-300" />
        <div className="mt-3 h-3 w-1/2 rounded bg-gray-300" />
      </div>
      <div className="mt-auto flex items-center gap-2 text-sm text-gray-500">
        <div className="h-3 w-3 rounded-full bg-gray-300" />
        <div className="h-3 w-3 rounded-full bg-gray-300" />
      </div>
    </div>
  );
};

const ProjectDetailModal: FC<{
  isOpen: boolean;
  handleModal: () => void;
  session?: Session | null;
  projectName: string;
}> = ({ isOpen, handleModal, session: authSession, projectName }) => {
  const { data: session, status } = useSession();
  const result = useQueries({
    queries: [
      {
        queryKey: [projectName, "details"],
        queryFn: () => {
          return githubClient.request<
            GetRepoDetailsResponse,
            GetRepoDetailsRequest
          >({
            document: GET_REPO_DETAILS,
            variables: {
              owner: authSession?.user?.name || session?.user?.name || "",
              name: projectName,
            },
            requestHeaders: {
              Authorization: `Bearer ${
                authSession?.accessToken ?? session?.accessToken
              }`,
            },
          });
        },
        enabled: (!!authSession || !!session) && isOpen,
      },
      {
        queryKey: [projectName, "issues"],
        queryFn: () => {
          return githubClient.request<
            GetRepoIssuesResponse,
            GetRepoIssuesRequest
          >({
            document: GET_REPO_ISSUES,
            variables: {
              owner: authSession?.user?.name || session?.user?.name || "",
              name: projectName,
              sort: "CREATED_AT",
              limit: 10,
            },
            requestHeaders: {
              Authorization: `Bearer ${
                authSession?.accessToken ?? session?.accessToken
              }`,
            },
          });
        },
        enabled: (!!authSession || !!session) && isOpen,
      },
    ],
  });
  return (
    <Modal
      isOpen={isOpen}
      handleModal={handleModal}
      className="relative mx-5 h-screen w-full max-w-[800px]">
      <div className="ctw-component-scroll-bar ctw-component-bg-secondary flex h-full w-full flex-col gap-5 overflow-y-scroll rounded-2xl p-10">
        <span
          className="i-mdi-close absolute top-0 right-0 mt-5 mr-5 h-7 w-7 cursor-pointer hover:opacity-50"
          onClick={handleModal}
        />
        <h3 className="text-3xl font-bold">
          {result?.[0]?.data?.repository?.name}
        </h3>
        <p className="text-sm text-gray-500">
          {result?.[0]?.data?.repository?.description}
        </p>
        <div className="flex flex-col gap-2">
          <h4 className="text-lg font-bold">Languages</h4>
          <span className="flex items-center gap-2 text-sm text-gray-500">
            {result?.[0]?.data?.repository?.primaryLanguage?.name}
            <div
              className="h-4 w-4 rounded-full bg-gray-500"
              style={{
                backgroundColor:
                  result?.[0]?.data?.repository?.primaryLanguage?.color,
              }}
            />
          </span>
        </div>
        <p className="break-words">
          {result?.[0].isLoading
            ? "LOADING..."
            : JSON.stringify(result?.[0].data)}
        </p>
        <p className="break-words">
          {result?.[1].isLoading
            ? "LOADING..."
            : JSON.stringify(result?.[1].data)}
        </p>
      </div>
    </Modal>
  );
};

const ProjectItem = forwardRef<
  HTMLDivElement,
  {
    repo: GetReposResponse["user"]["repositories"]["edges"][0]["node"];
  }
>(({ repo }, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  return (
    <>
      <div
        className="ctw-component-bg-card relative flex min-h-[140px] w-full flex-col rounded-lg py-2 px-4"
        ref={ref}>
        <div>
          <div className="flex w-full items-center justify-between">
            <h3 className="text-xl font-bold line-clamp-1">{repo.name}</h3>
            <span className="i-mdi-heart-outline h-5 w-5" />
          </div>
          <p className="mt-3 text-sm text-gray-500 line-clamp-2">
            {repo.description}
          </p>
        </div>
        <span className="mt-auto flex items-center gap-2 text-sm text-gray-500">
          {repo?.primaryLanguage?.name}
          <div
            className="h-3 w-3 rounded-full"
            style={{
              backgroundColor: repo?.primaryLanguage?.color,
            }}
          />
        </span>
        <Link
          shallow
          href={`/?project=${repo.name}`}
          as={`/project/${repo.name}`}
          className="absolute inset-0"
          onClick={() => setIsOpen(true)}
        />
      </div>
      <ProjectDetailModal
        isOpen={isOpen}
        handleModal={() => {
          setIsOpen(!isOpen);
          router.push("/", undefined, { shallow: true });
        }}
        projectName={repo.name}
      />
    </>
  );
});
ProjectItem.displayName = "ProjectItem";

const ProjectList: FC<Props> = ({ initialData, session: authSession }) => {
  const { data: session, status } = useSession();
  const {
    data,
    isFetching: isFetchingRepos,
    isSuccess,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery(["repos"], {
    queryFn: ({ pageParam, signal }) =>
      githubClient.request<GetReposResponse, GetReposRequest>({
        document: GET_REPOS,
        variables: {
          owner: !!authSession
            ? authSession.user.name ?? ""
            : session?.user?.name ?? "",
          limit: 10,
          sort: "CREATED_AT",
          cursor: pageParam,
        },
        requestHeaders: {
          Authorization: `Bearer ${
            authSession?.accessToken ?? session?.accessToken
          }`,
        },
        // @ts-ignore
        signal,
      }),
    getNextPageParam: (lastPage) => {
      if (lastPage.user.repositories.pageInfo.hasNextPage) {
        return lastPage.user.repositories.pageInfo.endCursor;
      }
      return undefined;
    },
    refetchOnWindowFocus: false,
    enabled: !!authSession
      ? !!authSession
      : status === "authenticated" && !!session?.accessToken,
    initialData: () => {
      if (!initialData) return undefined;
      return {
        pages: [initialData],
        pageParams: [undefined],
      };
    },
    staleTime: 1000 * 60 * 5,
  });
  const { ref } = useInfiniteScroll({
    isLoading: isFetchingRepos,
    hasMore: hasNextPage ?? false,
    onLoadMore: fetchNextPage,
    intersectionObserverInit: {
      rootMargin: "0px 0px 200px 0px",
    },
  });
  const flatData = useMemo(() => {
    if (!isSuccess || !data) return [];
    return data.pages.flatMap((page) => page.user.repositories.edges);
  }, [data, isSuccess]);
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
      {isSuccess &&
        flatData?.map((page, index) => {
          if (index === flatData.length - 1) {
            return (
              <ProjectItem key={page.node.id} repo={page.node} ref={ref} />
            );
          }
          return <ProjectItem key={page.node.id} repo={page.node} />;
        })}
      {isFetchingRepos &&
        [1, 2, 3, 4, 5, 6].map((num) => <ProjectLoader key={num} />)}
    </div>
  );
};

export default ProjectList;
