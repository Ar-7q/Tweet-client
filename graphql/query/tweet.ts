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
      likesCount
      author {
        id
        firstName
        lastName
        profileImageUrl
      }
      comments {
        id
        content
        createdAt

        author {
          id
          firstName
          lastName
          profileImageUrl
        }
      }
    }
  }
`);
