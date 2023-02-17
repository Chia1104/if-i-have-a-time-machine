import { useRef, useCallback } from "react";

export interface UseInfiniteScrollOptions {
  hasMore: boolean;
  isLoading: boolean;
  isError?: boolean;
  onLoadMore: () => void;
  intersectionObserverInit?: IntersectionObserverInit;
}

export interface UseInfiniteScrollResult {
  ref: (node: HTMLElement) => void;
  observer: IntersectionObserver | null;
}

const useInfiniteScroll = (
  option: UseInfiniteScrollOptions
): UseInfiniteScrollResult => {
  const {
    hasMore,
    isLoading,
    onLoadMore,
    intersectionObserverInit,
    isError = false,
  } = option;
  const observer = useRef<IntersectionObserver | null>(null);
  const ref = useCallback(
    (node: HTMLElement) => {
      if (isLoading || isError || !hasMore) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0]?.isIntersecting && hasMore) {
          onLoadMore();
        }
      }, intersectionObserverInit);
      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore]
  );
  return { ref, observer: observer.current };
};

export default useInfiniteScroll;
