import { GraphQLClient } from "graphql-request";

export const graphqlClient = new GraphQLClient(
  process.env.NEXT_PUBLIC_GRAPHQL_URL as string,
  {
    headers: () => {
      if (typeof window !== "undefined") {
        const token = window.localStorage.getItem("_tweet_token");

        return {
          Authorization: token ? `Bearer ${token}` : "",
        };
      }

      return {
        Authorization: "",
      };
    },
  }
);