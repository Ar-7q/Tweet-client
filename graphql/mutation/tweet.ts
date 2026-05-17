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
    uploadImage(image: $image) {
      imageURL
      imagePublicId
    }
  }
`);

export const deleteTweetMutation = graphql(`
  #graphql
  
  mutation DeleteTweet($tweetId: String!) {
    deleteTweet(tweetId: $tweetId)
  }
`);
