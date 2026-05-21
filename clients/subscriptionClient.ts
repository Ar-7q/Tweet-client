import { createClient } from "graphql-ws";


export const wsClient = createClient({
  url: "ws://localhost:7000/graphql",

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