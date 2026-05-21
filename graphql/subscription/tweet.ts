import { gql } from "@apollo/client";

export const TWEET_LIKED_SUBSCRIPTION = gql`
  subscription TweetLikedSubscription {
    tweetLiked {
      tweetId
      likesCount
    }
  }
`;

export const COMMENT_ADDED_SUBSCRIPTION = gql`
  subscription CommentAddedSubscription {
    commentAdded {
      tweetId

      comment {
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
`;

export const COMMENT_DELETED_SUBSCRIPTION = gql`
  subscription CommentDeletedSubscription {
    commentDeleted {
      tweetId
      commentId
    }
  }
`;

export const TWEET_CREATED_SUBSCRIPTION = gql`
  subscription TweetCreatedSubscription {
    tweetCreated {
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
`;

export const TWEET_DELETED_SUBSCRIPTION = gql`
  subscription TweetDeletedSubscription {
    tweetDeleted {
      tweetId
    }
  }
`;
