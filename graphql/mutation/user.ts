import { graphql } from "@/gql";

export const followUserMutation = graphql(`
  mutation FollowUser($to: String!) {
    followUser(to: $to)
  }
`);

export const unfollowUserMutation = graphql(`
  mutation UnfollowUser($to: String!) {
    unfollowUser(to: $to)
  }
`);
