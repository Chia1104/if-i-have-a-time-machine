import { type FC, forwardRef, useMemo } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import githubClient from "@/helpers/gql/github.client";
import {
  GET_REPOS,
  type GetReposRequest,
  type GetReposResponse,
} from "@/helpers/gql/query";
import { useSession } from "next-auth/react";
import { useInfiniteScroll } from "@/hooks";
import { type Session } from "next-auth";

interface Props {
  initialData?: GetReposResponse | null;
  session?: Session | null;
}

const ProjectItem = forwardRef<
  HTMLDivElement,
  {
    repo: GetReposResponse["user"]["repositories"]["edges"][0]["node"];
  }
>(({ repo }, ref) => {
  return (
    <div
      className="flex min-h-[100px] w-full flex-col rounded-lg border border-gray-200 p-2 shadow-sm"
      ref={ref}>
      <a href={repo.url} target="_blank" rel="noreferrer">
        <h3 className="text-xl font-bold">{repo.name}</h3>
      </a>
      <p className="text-sm text-gray-500">{repo.description}</p>
    </div>
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
    queryFn: ({ pageParam }) =>
      githubClient.request<GetReposResponse, GetReposRequest>(
        GET_REPOS,
        {
          owner: !!authSession
            ? authSession.user.name ?? ""
            : session?.user?.name ?? "",
          limit: 10,
          sort: "CREATED_AT",
          cursor: pageParam ? pageParam : undefined,
        },
        {
          Authorization: `Bearer ${session?.accessToken}`,
        }
      ),
    getNextPageParam: (lastPage) => {
      if (lastPage.user.repositories.pageInfo.hasNextPage) {
        return lastPage.user.repositories.pageInfo.endCursor;
      }
      return undefined;
    },
    enabled: !!authSession
      ? !!authSession
      : status === "authenticated" && !!session?.accessToken,
    // initialData: initialData && {
    //   pages: [initialData],
    //   pageParams: [initialData.user.repositories.pageInfo.endCursor],
    // },
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
      {isFetchingRepos && <p>Loading...</p>}
    </div>
  );
};

export default ProjectList;
