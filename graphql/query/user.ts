import { graphql } from "../../gql";

export const verifyGoogleTokenQuery = graphql(`#graphql
  query VerifyGoogleToken($token: String!) {
    verifyGoogleToken(token: $token)
  }
`);
