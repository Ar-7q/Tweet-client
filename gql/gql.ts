/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\n  #graphql\n\n  mutation CreateTweet($payload: CreateTweetData!) {\n    createTweet(payload: $payload) {\n      id\n    }\n  }\n": typeof types.CreateTweetDocument,
    "\n  #graphql\n\n  mutation DeleteTweet($tweetId: String!) {\n    deleteTweet(tweetId: $tweetId)\n  }\n": typeof types.DeleteTweetDocument,
    "\n  #graphql\n\n  mutation ToggleLike($tweetId: String!) {\n    toggleLike(tweetId: $tweetId)\n  }\n": typeof types.ToggleLikeDocument,
    "\n  #graphql\n\n  mutation CreateComment($tweetId: String!, $content: String!) {\n    createComment(tweetId: $tweetId, content: $content) {\n      id\n      content\n      createdAt\n    }\n  }\n": typeof types.CreateCommentDocument,
    "\n  #graphql\n\n  mutation DeleteComment($commentId: String!) {\n    deleteComment(commentId: $commentId)\n  }\n": typeof types.DeleteCommentDocument,
    "\n  mutation FollowUser($to: String!) {\n    followUser(to: $to)\n  }\n": typeof types.FollowUserDocument,
    "\n  mutation UnfollowUser($to: String!) {\n    unfollowUser(to: $to)\n  }\n": typeof types.UnfollowUserDocument,
    "\n  mutation LogoutUser {\n    logoutUser\n  }\n": typeof types.LogoutUserDocument,
    "\n  #graphql\n  query GetAllTweets {\n    getAllTweets {\n      id\n      content\n      imageURL\n      createdAt\n      imagePublicId\n      likesCount\n      author {\n        id\n        firstName\n        lastName\n        profileImageUrl\n      }\n      comments {\n        id\n        content\n        createdAt\n\n        author {\n          id\n          firstName\n          lastName\n          profileImageUrl\n        }\n      }\n    }\n  }\n": typeof types.GetAllTweetsDocument,
    "\n  #graphql\n  query VerifyGoogleToken($token: String!) {\n    verifyGoogleToken(token: $token)\n  }\n": typeof types.VerifyGoogleTokenDocument,
    "\n  query GetCurrentUser {\n    getCurrentUser {\n      id\n      profileImageUrl\n      email\n      firstName\n      lastName\n      tweets {\n        id\n        content\n        imageURL\n        author {\n          id\n          firstName\n          lastName\n          profileImageUrl\n        }\n      }\n\n      recommendedUsers {\n        id\n        firstName\n        lastName\n        profileImageUrl\n      }\n\n      following {\n        following {\n          id\n          firstName\n          lastName\n          profileImageUrl\n        }\n      }\n\n      followers {\n        follower {\n          id\n          firstName\n          lastName\n          profileImageUrl\n        }\n      }\n    }\n  }\n": typeof types.GetCurrentUserDocument,
    "\n  #graphql\n\n  query GetUserById($id: ID!) {\n    getUserById(id: $id) {\n      id\n      firstName\n      lastName\n      profileImageUrl\n\n      followers {\n        id\n\n        follower {\n          id\n          firstName\n          lastName\n          profileImageUrl\n        }\n      }\n\n      following {\n        id\n\n        following {\n          id\n          firstName\n          lastName\n          profileImageUrl\n        }\n      }\n      tweets {\n        content\n        id\n        imageURL\n        createdAt\n        imagePublicId\n\n        likesCount\n\n        comments {\n          id\n          content\n          createdAt\n\n          author {\n            id\n            firstName\n            lastName\n            profileImageUrl\n          }\n        }\n\n        author {\n          id\n          firstName\n          lastName\n          profileImageUrl\n        }\n      }\n\n      recommendedUsers {\n        id\n        firstName\n        lastName\n        profileImageUrl\n      }\n    }\n  }\n": typeof types.GetUserByIdDocument,
    "\n  subscription TweetLikedSubscription {\n    tweetLiked {\n      tweetId\n      likesCount\n    }\n  }\n": typeof types.TweetLikedSubscriptionDocument,
    "\n  subscription CommentAddedSubscription {\n    commentAdded {\n      tweetId\n\n      comment {\n        id\n        content\n        createdAt\n\n        author {\n          id\n          firstName\n          lastName\n          profileImageUrl\n        }\n      }\n    }\n  }\n": typeof types.CommentAddedSubscriptionDocument,
    "\n  subscription CommentDeletedSubscription {\n    commentDeleted {\n      tweetId\n      commentId\n    }\n  }\n": typeof types.CommentDeletedSubscriptionDocument,
    "\n  subscription TweetCreatedSubscription {\n    tweetCreated {\n      id\n      content\n      imageURL\n      createdAt\n      imagePublicId\n\n      likesCount\n\n      author {\n        id\n        firstName\n        lastName\n        profileImageUrl\n      }\n\n      comments {\n        id\n        content\n        createdAt\n\n        author {\n          id\n          firstName\n          lastName\n          profileImageUrl\n        }\n      }\n    }\n  }\n": typeof types.TweetCreatedSubscriptionDocument,
    "\n  subscription TweetDeletedSubscription {\n    tweetDeleted {\n      tweetId\n    }\n  }\n": typeof types.TweetDeletedSubscriptionDocument,
    "\n  subscription UserFollowedSubscription {\n    userFollowed {\n      userId\n      followerId\n      type\n    }\n  }\n": typeof types.UserFollowedSubscriptionDocument,
};
const documents: Documents = {
    "\n  #graphql\n\n  mutation CreateTweet($payload: CreateTweetData!) {\n    createTweet(payload: $payload) {\n      id\n    }\n  }\n": types.CreateTweetDocument,
    "\n  #graphql\n\n  mutation DeleteTweet($tweetId: String!) {\n    deleteTweet(tweetId: $tweetId)\n  }\n": types.DeleteTweetDocument,
    "\n  #graphql\n\n  mutation ToggleLike($tweetId: String!) {\n    toggleLike(tweetId: $tweetId)\n  }\n": types.ToggleLikeDocument,
    "\n  #graphql\n\n  mutation CreateComment($tweetId: String!, $content: String!) {\n    createComment(tweetId: $tweetId, content: $content) {\n      id\n      content\n      createdAt\n    }\n  }\n": types.CreateCommentDocument,
    "\n  #graphql\n\n  mutation DeleteComment($commentId: String!) {\n    deleteComment(commentId: $commentId)\n  }\n": types.DeleteCommentDocument,
    "\n  mutation FollowUser($to: String!) {\n    followUser(to: $to)\n  }\n": types.FollowUserDocument,
    "\n  mutation UnfollowUser($to: String!) {\n    unfollowUser(to: $to)\n  }\n": types.UnfollowUserDocument,
    "\n  mutation LogoutUser {\n    logoutUser\n  }\n": types.LogoutUserDocument,
    "\n  #graphql\n  query GetAllTweets {\n    getAllTweets {\n      id\n      content\n      imageURL\n      createdAt\n      imagePublicId\n      likesCount\n      author {\n        id\n        firstName\n        lastName\n        profileImageUrl\n      }\n      comments {\n        id\n        content\n        createdAt\n\n        author {\n          id\n          firstName\n          lastName\n          profileImageUrl\n        }\n      }\n    }\n  }\n": types.GetAllTweetsDocument,
    "\n  #graphql\n  query VerifyGoogleToken($token: String!) {\n    verifyGoogleToken(token: $token)\n  }\n": types.VerifyGoogleTokenDocument,
    "\n  query GetCurrentUser {\n    getCurrentUser {\n      id\n      profileImageUrl\n      email\n      firstName\n      lastName\n      tweets {\n        id\n        content\n        imageURL\n        author {\n          id\n          firstName\n          lastName\n          profileImageUrl\n        }\n      }\n\n      recommendedUsers {\n        id\n        firstName\n        lastName\n        profileImageUrl\n      }\n\n      following {\n        following {\n          id\n          firstName\n          lastName\n          profileImageUrl\n        }\n      }\n\n      followers {\n        follower {\n          id\n          firstName\n          lastName\n          profileImageUrl\n        }\n      }\n    }\n  }\n": types.GetCurrentUserDocument,
    "\n  #graphql\n\n  query GetUserById($id: ID!) {\n    getUserById(id: $id) {\n      id\n      firstName\n      lastName\n      profileImageUrl\n\n      followers {\n        id\n\n        follower {\n          id\n          firstName\n          lastName\n          profileImageUrl\n        }\n      }\n\n      following {\n        id\n\n        following {\n          id\n          firstName\n          lastName\n          profileImageUrl\n        }\n      }\n      tweets {\n        content\n        id\n        imageURL\n        createdAt\n        imagePublicId\n\n        likesCount\n\n        comments {\n          id\n          content\n          createdAt\n\n          author {\n            id\n            firstName\n            lastName\n            profileImageUrl\n          }\n        }\n\n        author {\n          id\n          firstName\n          lastName\n          profileImageUrl\n        }\n      }\n\n      recommendedUsers {\n        id\n        firstName\n        lastName\n        profileImageUrl\n      }\n    }\n  }\n": types.GetUserByIdDocument,
    "\n  subscription TweetLikedSubscription {\n    tweetLiked {\n      tweetId\n      likesCount\n    }\n  }\n": types.TweetLikedSubscriptionDocument,
    "\n  subscription CommentAddedSubscription {\n    commentAdded {\n      tweetId\n\n      comment {\n        id\n        content\n        createdAt\n\n        author {\n          id\n          firstName\n          lastName\n          profileImageUrl\n        }\n      }\n    }\n  }\n": types.CommentAddedSubscriptionDocument,
    "\n  subscription CommentDeletedSubscription {\n    commentDeleted {\n      tweetId\n      commentId\n    }\n  }\n": types.CommentDeletedSubscriptionDocument,
    "\n  subscription TweetCreatedSubscription {\n    tweetCreated {\n      id\n      content\n      imageURL\n      createdAt\n      imagePublicId\n\n      likesCount\n\n      author {\n        id\n        firstName\n        lastName\n        profileImageUrl\n      }\n\n      comments {\n        id\n        content\n        createdAt\n\n        author {\n          id\n          firstName\n          lastName\n          profileImageUrl\n        }\n      }\n    }\n  }\n": types.TweetCreatedSubscriptionDocument,
    "\n  subscription TweetDeletedSubscription {\n    tweetDeleted {\n      tweetId\n    }\n  }\n": types.TweetDeletedSubscriptionDocument,
    "\n  subscription UserFollowedSubscription {\n    userFollowed {\n      userId\n      followerId\n      type\n    }\n  }\n": types.UserFollowedSubscriptionDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  #graphql\n\n  mutation CreateTweet($payload: CreateTweetData!) {\n    createTweet(payload: $payload) {\n      id\n    }\n  }\n"): (typeof documents)["\n  #graphql\n\n  mutation CreateTweet($payload: CreateTweetData!) {\n    createTweet(payload: $payload) {\n      id\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  #graphql\n\n  mutation DeleteTweet($tweetId: String!) {\n    deleteTweet(tweetId: $tweetId)\n  }\n"): (typeof documents)["\n  #graphql\n\n  mutation DeleteTweet($tweetId: String!) {\n    deleteTweet(tweetId: $tweetId)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  #graphql\n\n  mutation ToggleLike($tweetId: String!) {\n    toggleLike(tweetId: $tweetId)\n  }\n"): (typeof documents)["\n  #graphql\n\n  mutation ToggleLike($tweetId: String!) {\n    toggleLike(tweetId: $tweetId)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  #graphql\n\n  mutation CreateComment($tweetId: String!, $content: String!) {\n    createComment(tweetId: $tweetId, content: $content) {\n      id\n      content\n      createdAt\n    }\n  }\n"): (typeof documents)["\n  #graphql\n\n  mutation CreateComment($tweetId: String!, $content: String!) {\n    createComment(tweetId: $tweetId, content: $content) {\n      id\n      content\n      createdAt\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  #graphql\n\n  mutation DeleteComment($commentId: String!) {\n    deleteComment(commentId: $commentId)\n  }\n"): (typeof documents)["\n  #graphql\n\n  mutation DeleteComment($commentId: String!) {\n    deleteComment(commentId: $commentId)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation FollowUser($to: String!) {\n    followUser(to: $to)\n  }\n"): (typeof documents)["\n  mutation FollowUser($to: String!) {\n    followUser(to: $to)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UnfollowUser($to: String!) {\n    unfollowUser(to: $to)\n  }\n"): (typeof documents)["\n  mutation UnfollowUser($to: String!) {\n    unfollowUser(to: $to)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation LogoutUser {\n    logoutUser\n  }\n"): (typeof documents)["\n  mutation LogoutUser {\n    logoutUser\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  #graphql\n  query GetAllTweets {\n    getAllTweets {\n      id\n      content\n      imageURL\n      createdAt\n      imagePublicId\n      likesCount\n      author {\n        id\n        firstName\n        lastName\n        profileImageUrl\n      }\n      comments {\n        id\n        content\n        createdAt\n\n        author {\n          id\n          firstName\n          lastName\n          profileImageUrl\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  #graphql\n  query GetAllTweets {\n    getAllTweets {\n      id\n      content\n      imageURL\n      createdAt\n      imagePublicId\n      likesCount\n      author {\n        id\n        firstName\n        lastName\n        profileImageUrl\n      }\n      comments {\n        id\n        content\n        createdAt\n\n        author {\n          id\n          firstName\n          lastName\n          profileImageUrl\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  #graphql\n  query VerifyGoogleToken($token: String!) {\n    verifyGoogleToken(token: $token)\n  }\n"): (typeof documents)["\n  #graphql\n  query VerifyGoogleToken($token: String!) {\n    verifyGoogleToken(token: $token)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetCurrentUser {\n    getCurrentUser {\n      id\n      profileImageUrl\n      email\n      firstName\n      lastName\n      tweets {\n        id\n        content\n        imageURL\n        author {\n          id\n          firstName\n          lastName\n          profileImageUrl\n        }\n      }\n\n      recommendedUsers {\n        id\n        firstName\n        lastName\n        profileImageUrl\n      }\n\n      following {\n        following {\n          id\n          firstName\n          lastName\n          profileImageUrl\n        }\n      }\n\n      followers {\n        follower {\n          id\n          firstName\n          lastName\n          profileImageUrl\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetCurrentUser {\n    getCurrentUser {\n      id\n      profileImageUrl\n      email\n      firstName\n      lastName\n      tweets {\n        id\n        content\n        imageURL\n        author {\n          id\n          firstName\n          lastName\n          profileImageUrl\n        }\n      }\n\n      recommendedUsers {\n        id\n        firstName\n        lastName\n        profileImageUrl\n      }\n\n      following {\n        following {\n          id\n          firstName\n          lastName\n          profileImageUrl\n        }\n      }\n\n      followers {\n        follower {\n          id\n          firstName\n          lastName\n          profileImageUrl\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  #graphql\n\n  query GetUserById($id: ID!) {\n    getUserById(id: $id) {\n      id\n      firstName\n      lastName\n      profileImageUrl\n\n      followers {\n        id\n\n        follower {\n          id\n          firstName\n          lastName\n          profileImageUrl\n        }\n      }\n\n      following {\n        id\n\n        following {\n          id\n          firstName\n          lastName\n          profileImageUrl\n        }\n      }\n      tweets {\n        content\n        id\n        imageURL\n        createdAt\n        imagePublicId\n\n        likesCount\n\n        comments {\n          id\n          content\n          createdAt\n\n          author {\n            id\n            firstName\n            lastName\n            profileImageUrl\n          }\n        }\n\n        author {\n          id\n          firstName\n          lastName\n          profileImageUrl\n        }\n      }\n\n      recommendedUsers {\n        id\n        firstName\n        lastName\n        profileImageUrl\n      }\n    }\n  }\n"): (typeof documents)["\n  #graphql\n\n  query GetUserById($id: ID!) {\n    getUserById(id: $id) {\n      id\n      firstName\n      lastName\n      profileImageUrl\n\n      followers {\n        id\n\n        follower {\n          id\n          firstName\n          lastName\n          profileImageUrl\n        }\n      }\n\n      following {\n        id\n\n        following {\n          id\n          firstName\n          lastName\n          profileImageUrl\n        }\n      }\n      tweets {\n        content\n        id\n        imageURL\n        createdAt\n        imagePublicId\n\n        likesCount\n\n        comments {\n          id\n          content\n          createdAt\n\n          author {\n            id\n            firstName\n            lastName\n            profileImageUrl\n          }\n        }\n\n        author {\n          id\n          firstName\n          lastName\n          profileImageUrl\n        }\n      }\n\n      recommendedUsers {\n        id\n        firstName\n        lastName\n        profileImageUrl\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  subscription TweetLikedSubscription {\n    tweetLiked {\n      tweetId\n      likesCount\n    }\n  }\n"): (typeof documents)["\n  subscription TweetLikedSubscription {\n    tweetLiked {\n      tweetId\n      likesCount\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  subscription CommentAddedSubscription {\n    commentAdded {\n      tweetId\n\n      comment {\n        id\n        content\n        createdAt\n\n        author {\n          id\n          firstName\n          lastName\n          profileImageUrl\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  subscription CommentAddedSubscription {\n    commentAdded {\n      tweetId\n\n      comment {\n        id\n        content\n        createdAt\n\n        author {\n          id\n          firstName\n          lastName\n          profileImageUrl\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  subscription CommentDeletedSubscription {\n    commentDeleted {\n      tweetId\n      commentId\n    }\n  }\n"): (typeof documents)["\n  subscription CommentDeletedSubscription {\n    commentDeleted {\n      tweetId\n      commentId\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  subscription TweetCreatedSubscription {\n    tweetCreated {\n      id\n      content\n      imageURL\n      createdAt\n      imagePublicId\n\n      likesCount\n\n      author {\n        id\n        firstName\n        lastName\n        profileImageUrl\n      }\n\n      comments {\n        id\n        content\n        createdAt\n\n        author {\n          id\n          firstName\n          lastName\n          profileImageUrl\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  subscription TweetCreatedSubscription {\n    tweetCreated {\n      id\n      content\n      imageURL\n      createdAt\n      imagePublicId\n\n      likesCount\n\n      author {\n        id\n        firstName\n        lastName\n        profileImageUrl\n      }\n\n      comments {\n        id\n        content\n        createdAt\n\n        author {\n          id\n          firstName\n          lastName\n          profileImageUrl\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  subscription TweetDeletedSubscription {\n    tweetDeleted {\n      tweetId\n    }\n  }\n"): (typeof documents)["\n  subscription TweetDeletedSubscription {\n    tweetDeleted {\n      tweetId\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  subscription UserFollowedSubscription {\n    userFollowed {\n      userId\n      followerId\n      type\n    }\n  }\n"): (typeof documents)["\n  subscription UserFollowedSubscription {\n    userFollowed {\n      userId\n      followerId\n      type\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;