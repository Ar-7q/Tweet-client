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
        }
      }

      following {
        id

        following {
          id
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
    }
  }
`);
