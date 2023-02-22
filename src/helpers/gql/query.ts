import { gql } from "graphql-request";

type Error = {
  type: string;
  path: string[];
  locations: {
    line: number;
    column: number;
  }[];
  message: string;
}[];

type GetIssuesRequest = {
  owner: string;
  name: string;
  sort: "CREATED_AT" | "UPDATED_AT" | "COMMENTS";
  limit: number;
};

type GetIssuesResponse = {
  repository: {
    issues: {
      edges: {
        node: {
          id: string;
          title: string;
          url: string;
          createdAt: string;
          author: {
            avatarUrl: string;
            login: string;
            url: string;
          };
          labels: {
            edges: {
              node: {
                name: string;
                color: string;
              }[];
            };
          };
        }[];
      };
    };
  };
};

const GET_ISSUES = gql`
  query (
    $owner: String!
    $name: String!
    $sort: IssueOrderField!
    $limit: Int
  ) {
    repository(owner: $owner, name: $name) {
      issues(
        first: $limit
        orderBy: { field: $sort, direction: DESC }
        states: CLOSED
      ) {
        edges {
          node {
            id
            title
            url
            createdAt
            author {
              avatarUrl
              login
              url
            }
            labels(first: 5) {
              edges {
                node {
                  name
                  color
                }
              }
            }
          }
        }
      }
    }
  }
`;

type GetReposRequest = {
  owner: string;
  sort: "CREATED_AT" | "UPDATED_AT" | "PUSHED_AT" | "NAME";
  limit: number;
  cursor?: string;
};

type GetReposResponse = {
  user: {
    repositories: {
      edges: {
        node: {
          id: string;
          name: string;
          url: string;
          description: string;
          updatedAt: string;
          stargazers: {
            totalCount: number;
          };
          forks: {
            totalCount: number;
          };
          primaryLanguage: {
            name: string;
            color: string;
          };
        };
      }[];
      pageInfo: {
        hasNextPage: boolean;
        endCursor: string;
      };
    };
  };
};

const GET_REPOS = gql`
  query (
    $owner: String!
    $limit: Int!
    $sort: RepositoryOrderField!
    $cursor: String
  ) {
    user(login: $owner) {
      repositories(
        first: $limit
        orderBy: { field: $sort, direction: DESC }
        after: $cursor
      ) {
        edges {
          node {
            id
            name
            url
            description
            updatedAt
            stargazers {
              totalCount
            }
            forks {
              totalCount
            }
            primaryLanguage {
              name
              color
            }
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  }
`;

export { GET_ISSUES, GET_REPOS };
export type {
  GetIssuesRequest,
  GetIssuesResponse,
  GetReposRequest,
  GetReposResponse,
  Error,
};
