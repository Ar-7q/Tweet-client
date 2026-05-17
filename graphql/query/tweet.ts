import { graphql } from "@/gql";

export const getAllTweetsQuery = graphql(`
  #graphql
  query GetAllTweets {
    getAllTweets {
      id
      content
      imageURL
      createdAt
      imagePublicId
      author {
        id
        firstName
        lastName
        profileImageUrl
      }
    }
  }
`);
