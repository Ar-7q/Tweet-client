import { createClient } from "graphql-ws";


export const wsClient = createClient({
  url: process.env.NEXT_PUBLIC_GRAPHQL_WS_URL as string,

  connectionParams: () => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("__tweet_token");

      return {
        authorization: token
          ? `Bearer ${token}`
          : "",
      };
    }

    return {};
  },
});