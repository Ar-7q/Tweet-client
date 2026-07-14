import { wsClient } from "@/clients/subscriptionClient";
import {
  COMMENT_ADDED_SUBSCRIPTION,
  COMMENT_DELETED_SUBSCRIPTION,
  TWEET_CREATED_SUBSCRIPTION,
  TWEET_DELETED_SUBSCRIPTION,
  TWEET_LIKED_SUBSCRIPTION,
} from "@/graphql/subscription/tweet";
import { USER_FOLLOWED_SUBSCRIPTION } from "@/graphql/subscription/users";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

export const useTweetLikeSubscription = () => {
  const queryClient = useQueryClient();
  useEffect(() => {
    const unsubscribe = wsClient.subscribe(
      {
        query: TWEET_LIKED_SUBSCRIPTION.loc?.source.body!,
      },

      {
        next: (data: any) => {
          const event = data?.data?.tweetLiked;

          if (!event) return;

          queryClient.setQueryData(["all-tweets"], (oldData: any) => {
            if (!oldData?.getAllTweets) return oldData;

            return {
              ...oldData,

              getAllTweets: oldData.getAllTweets.map((tweet: any) =>
                tweet.id === event.tweetId
                  ? {
                      ...tweet,
                      likesCount: event.likesCount,
                    }
                  : tweet,
              ),
            };
          });
          queryClient.invalidateQueries({
            queryKey: ["current-user"],
          });
          queryClient.setQueriesData(
            {
              queryKey: ["user-by-id"],
            },
            (oldData: any) => {
              if (!oldData?.getUserById) return oldData;

              return {
                ...oldData,
                getUserById: {
                  ...oldData.getUserById,
                  tweets: (oldData.getUserById.tweets || []).map((tweet: any) =>
                    tweet.id === event.tweetId
                      ? {
                          ...tweet,
                          likesCount: event.likesCount,
                        }
                      : tweet,
                  ),
                },
              };
            },
          );
        },

        error: console.error,

        complete: () => {},
      },
    );

    return () => {
      unsubscribe();
    };
  }, [queryClient]);
};

export const useCommentSubscription = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const unsubscribe = wsClient.subscribe(
      {
        query: COMMENT_ADDED_SUBSCRIPTION.loc?.source.body!,
      },

      {
        next: (data: any) => {
          const event = data?.data?.commentAdded;

          if (!event) return;

          queryClient.setQueryData(["all-tweets"], (oldData: any) => {
            if (!oldData?.getAllTweets) return oldData;

            return {
              ...oldData,

              getAllTweets: oldData.getAllTweets.map((tweet: any) =>
                tweet.id === event.tweetId
                  ? {
                      ...tweet,

                      comments: [...(tweet.comments || []), event.comment],
                    }
                  : tweet,
              ),
            };
          });

          queryClient.invalidateQueries({
            queryKey: ["current-user"],
          });

          queryClient.setQueriesData(
            {
              queryKey: ["user-by-id"],
            },
            (oldData: any) => {
              if (!oldData?.getUserById) return oldData;

              return {
                ...oldData,
                getUserById: {
                  ...oldData.getUserById,
                  tweets: (oldData.getUserById.tweets || []).map((tweet: any) =>
                    tweet.id === event.tweetId
                      ? {
                          ...tweet,
                          comments: [...(tweet.comments || []), event.comment],
                        }
                      : tweet,
                  ),
                },
              };
            },
          );
        },

        error: console.error,

        complete: () => {},
      },
    );

    return () => {
      unsubscribe();
    };
  }, [queryClient]);
};

export const useTweetCreateSubscription = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const unsubscribe = wsClient.subscribe(
      {
        query: TWEET_CREATED_SUBSCRIPTION.loc?.source.body!,
      },

      {
        next: (data: any) => {
          const event = data?.data?.tweetCreated;

          if (!event) return;

          queryClient.setQueryData(["all-tweets"], (oldData: any) => {
            if (!oldData?.getAllTweets) return oldData;

            return {
              ...oldData,

              getAllTweets: [event, ...oldData.getAllTweets],
            };
          });

          queryClient.invalidateQueries({
            queryKey: ["current-user"],
          });

          queryClient.invalidateQueries({
            queryKey: ["user-by-id"],
          });
        },

        error: console.error,

        complete: () => {},
      },
    );

    return () => {
      unsubscribe();
    };
  }, [queryClient]);
};

export const useTweetDeleteSubscription = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const unsubscribe = wsClient.subscribe(
      {
        query: TWEET_DELETED_SUBSCRIPTION.loc?.source.body!,
      },

      {
        next: (data: any) => {
          const event = data?.data?.tweetDeleted;

          if (!event) return;

          queryClient.setQueryData(["all-tweets"], (oldData: any) => {
            if (!oldData?.getAllTweets) return oldData;

            return {
              ...oldData,

              getAllTweets: oldData.getAllTweets.filter((tweet: any) => tweet.id !== event.tweetId),
            };
          });

          queryClient.invalidateQueries({
            queryKey: ["current-user"],
          });

          queryClient.invalidateQueries({
            queryKey: ["user-by-id"],
          });
        },

        error: console.error,

        complete: () => {},
      },
    );

    return () => {
      unsubscribe();
    };
  }, [queryClient]);
};

export const useCommentDeleteSubscription = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const unsubscribe = wsClient.subscribe(
      {
        query: COMMENT_DELETED_SUBSCRIPTION.loc?.source.body!,
      },

      {
        next: (data: any) => {
          const event = data?.data?.commentDeleted;

          if (!event) return;

          queryClient.setQueryData(["all-tweets"], (oldData: any) => {
            if (!oldData?.getAllTweets) return oldData;

            return {
              ...oldData,

              getAllTweets: oldData.getAllTweets.map((tweet: any) =>
                tweet.id === event.tweetId
                  ? {
                      ...tweet,

                      comments: tweet.comments.filter((comment: any) => comment.id !== event.commentId),
                    }
                  : tweet,
              ),
            };
          });
          queryClient.invalidateQueries({
            queryKey: ["current-user"],
          });

          queryClient.setQueriesData(
            {
              queryKey: ["user-by-id"],
            },
            (oldData: any) => {
              if (!oldData?.getUserById) return oldData;

              return {
                ...oldData,
                getUserById: {
                  ...oldData.getUserById,
                  tweets: (oldData.getUserById.tweets || []).map((tweet: any) =>
                    tweet.id === event.tweetId
                      ? {
                          ...tweet,
                          comments: tweet.comments.filter((comment: any) => comment.id !== event.commentId),
                        }
                      : tweet,
                  ),
                },
              };
            },
          );
        },

        error: console.error,

        complete: () => {},
      },
    );

    return () => {
      unsubscribe();
    };
  }, [queryClient]);
};

export const useFollowSubscription = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const unsubscribe = wsClient.subscribe(
      {
        query: USER_FOLLOWED_SUBSCRIPTION.loc?.source.body!,
      },

      {
        next: () => {
          queryClient.invalidateQueries({
            queryKey: ["current-user"],
          });

          queryClient.invalidateQueries({
            queryKey: ["user-by-id"],
          });
        },

        error: console.error,

        complete: () => {},
      },
    );

    return () => {
      unsubscribe();
    };
  }, [queryClient]);
};
