import { graphql } from "@/gql";

export const createTweetMutation = graphql(`
  #graphql

  mutation CreateTweet($payload: CreateTweetData!) {
    createTweet(payload: $payload) {
      id
      
    }
  }
`);

export const uploadImageMutation = graphql(`
  #graphql

  mutation UploadImage($image: String!) {
    uploadImage(image: $image)
  }
`);
// content
//       imageURL
//       author {
//         id
//         firstName
//         lastName
//         profileImageUrl
//       }