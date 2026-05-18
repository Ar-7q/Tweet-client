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

export const toggleLikeMutation = graphql(`
  #graphql

  mutation ToggleLike($tweetId: String!) {
    toggleLike(tweetId: $tweetId)
  }
`);

export const createCommentMutation = graphql(`
  #graphql

  mutation CreateComment($tweetId: String!, $content: String!) {
    createComment(tweetId: $tweetId, content: $content) {
      id
      content
      createdAt
    }
  }
`);

export const deleteCommentMutation = graphql(`
  #graphql

  mutation DeleteComment($commentId: String!) {
    deleteComment(commentId: $commentId)
  }
`);
