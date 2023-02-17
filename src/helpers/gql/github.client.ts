import { GraphQLClient } from "graphql-request";

const GITHUB_GRAPHQL_API = "https://api.github.com/graphql";

const client = new GraphQLClient(GITHUB_GRAPHQL_API);

export default client;
