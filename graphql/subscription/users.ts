import { gql } from "@apollo/client";

export const USER_FOLLOWED_SUBSCRIPTION = gql`
  subscription UserFollowedSubscription {
    userFollowed {
      userId
      followerId
      type
    }
  }
`;