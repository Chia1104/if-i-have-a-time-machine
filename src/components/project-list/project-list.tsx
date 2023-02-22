import { type FC, forwardRef, useMemo, useState } from "react";
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
      <Modal
        isOpen={isOpen}
        handleModal={() => {
          setIsOpen(!isOpen);
          router.push("/", undefined, { shallow: true });
        }}
        className="mx-5 w-full max-w-[800px]">
        <div className="ctw-component-bg-secondary flex w-full flex-col gap-5 rounded-2xl p-10">
          <h3 className="text-xl font-bold">{repo?.name}</h3>
          <p className="text-sm text-gray-500">{repo?.description}</p>
          <div className="flex flex-col gap-2">
            <h4 className="text-lg font-bold">Languages</h4>
            <span className="flex items-center gap-2 text-sm text-gray-500">
              {repo?.primaryLanguage?.name}
              <div
                className="h-4 w-4 rounded-full bg-gray-500"
                style={{
                  backgroundColor: repo?.primaryLanguage?.color,
                }}
              />
            </span>
          </div>
        </div>
      </Modal>
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
          cursor: pageParam ? pageParam : undefined,
        },
        requestHeaders: {
          Authorization: `Bearer ${session?.accessToken}`,
        },
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
      {isFetchingRepos &&
        [1, 2, 3, 4, 5, 6].map((num) => <ProjectLoader key={num} />)}
    </div>
  );
};

export default ProjectList;
