import { GraphQLClient } from "graphql-request";

const GITHUB_GRAPHQL_API = "https://api.github.com/graphql";
const GH_PUBLIC_TOKEN = "token";

const client = new GraphQLClient(GITHUB_GRAPHQL_API, {
  headers: {
    accept: "application/vnd.github.v3+json",
    authorization: `token ${GH_PUBLIC_TOKEN}`,
  },
});

export default client;
