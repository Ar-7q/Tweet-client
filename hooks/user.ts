import { graphqlClient } from "@/clients/api";
import { getCurrentUserQuery, getUserByIdQuery } from "@/graphql/query/user";

import { useQuery } from "@tanstack/react-query";

export const useCurrentUser = () => {
  const query = useQuery({
    queryKey: ["current-user"],

    queryFn: () => graphqlClient.request(getCurrentUserQuery),

    refetchInterval: 2000,

    staleTime: 0,

    refetchOnWindowFocus: true,
  });

  return {
    ...query,
    user: query.data?.getCurrentUser,
  };
};

export const useGetUserById = (id: string) => {
  const query = useQuery({
    queryKey: ["user-by-id", id],

    queryFn: () =>
      graphqlClient.request(getUserByIdQuery, {
        id,
      }),

    refetchInterval: 2000,

    staleTime: 0,

    refetchOnWindowFocus: true,
  });

  return {
    ...query,
    user: query.data?.getUserById,
  };
};
