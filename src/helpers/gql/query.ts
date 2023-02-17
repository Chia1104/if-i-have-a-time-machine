import { gql } from "graphql-request";

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

export { GET_ISSUES };
