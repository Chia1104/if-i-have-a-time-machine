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

type GetRepoDetailsRequest = {
  owner: string;
  name: string;
};

type GetRepoDetailsResponse = {
  repository: {
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
};

const GET_REPO_DETAILS = gql`
  query ($owner: String!, $name: String!) {
    repository(owner: $owner, name: $name) {
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
`;

type GetRepoIssuesRequest = {
  owner: string;
  name: string;
  limit: number;
  cursor?: string;
  sort: "CREATED_AT" | "UPDATED_AT" | "COMMENTS";
};

type GetRepoIssuesResponse = {
  repository: {
    issues: {
      edges: {
        node: {
          id: string;
          title: string;
          url: string;
          createdAt: string;
          state: string;
          closedAt: string;
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
              };
            }[];
          };
        };
      }[];
    };
  };
};

const GET_REPO_ISSUES = gql`
  query (
    $owner: String!
    $name: String!
    $limit: Int!
    $cursor: String
    $sort: IssueOrderField!
  ) {
    repository(owner: $owner, name: $name) {
      issues(
        first: $limit
        orderBy: { field: $sort, direction: DESC }
        after: $cursor
      ) {
        edges {
          node {
            id
            title
            url
            createdAt
            state
            closedAt
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

export { GET_ISSUES, GET_REPOS, GET_REPO_ISSUES, GET_REPO_DETAILS };
export type {
  GetIssuesRequest,
  GetIssuesResponse,
  GetReposRequest,
  GetReposResponse,
  Error,
  GetRepoDetailsRequest,
  GetRepoDetailsResponse,
  GetRepoIssuesRequest,
  GetRepoIssuesResponse,
};
