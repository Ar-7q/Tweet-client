import { graphql } from "../../gql";

export const verifyGoogleTokenQuery = graphql(`
  #graphql
  query VerifyGoogleToken($token: String!) {
    verifyGoogleToken(token: $token)
  }
`);

export const getCurrentUserQuery = graphql(`
  query GetCurrentUser {
    getCurrentUser {
      id
      profileImageUrl
      email
      firstName
      lastName
      tweets {
        id
        content
        imageURL
        author {
          id
          firstName
          lastName
          profileImageUrl
        }
      }

      recommendedUsers {
        id
        firstName
        lastName
        profileImageUrl
      }

      following {
        following {
          id
          firstName
          lastName
          profileImageUrl
        }
      }

      followers {
        follower {
          id
          firstName
          lastName
          profileImageUrl
        }
      }
    }
  }
`);

export const getUserByIdQuery = graphql(`
  #graphql

  query GetUserById($id: ID!) {
    getUserById(id: $id) {
      id
      firstName
      lastName
      profileImageUrl

      followers {
        id

        follower {
          id
          firstName
          lastName
          profileImageUrl
        }
      }

      following {
        id

        following {
          id
          firstName
          lastName
          profileImageUrl
        }
      }
      tweets {
        content
        id
        imageURL
        createdAt
        imagePublicId

        likesCount

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

        author {
          id
          firstName
          lastName
          profileImageUrl
        }
      }

      recommendedUsers {
        id
        firstName
        lastName
        profileImageUrl
      }
    }
  }
`);
