import { type FC, forwardRef } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import githubClient from "@/helpers/gql/github.client";
import {
  GET_REPOS,
  GetReposRequest,
  GetReposResponse,
} from "@/helpers/gql/query";
import { useSession } from "next-auth/react";
import { useInfiniteScroll } from "@/hooks";

interface Props {
  initialData?: GetReposResponse | null;
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

const ProjectList: FC<Props> = ({ initialData }) => {
  const { data: session, status } = useSession();
  const {
    data,
    isLoading: isLoadingRepos,
    isSuccess,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery(["repos"], {
    queryFn: ({ pageParam = "" }) =>
      githubClient.request<GetReposResponse, GetReposRequest>(
        GET_REPOS,
        {
          owner: session?.user?.name ?? "",
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
    enabled: status === "authenticated" && !!session?.accessToken,
    // initialData: initialData ? { pages: [initialData] } : undefined,
  });
  const { ref } = useInfiniteScroll({
    isLoading: isLoadingRepos,
    hasMore: hasNextPage ?? false,
    onLoadMore: fetchNextPage,
    intersectionObserverInit: {
      rootMargin: "0px 0px 200px 0px",
    },
  });
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
      {isSuccess &&
        data?.pages.map((page) => {
          return page.user.repositories.edges.map((edge, i) => {
            return (
              <>
                {page.user.repositories.edges.length - 1 === i ? (
                  <ProjectItem key={edge.node.id} repo={edge.node} ref={ref} />
                ) : (
                  <ProjectItem key={edge.node.id} repo={edge.node} />
                )}
              </>
            );
          });
        })}
      {isLoadingRepos && <p>Loading...</p>}
    </div>
  );
};

export default ProjectList;
