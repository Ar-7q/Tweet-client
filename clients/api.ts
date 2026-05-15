import { GraphQLClient } from "graphql-request";

export const graphqlClient = new GraphQLClient(
  "http://localhost:7000/graphql",
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