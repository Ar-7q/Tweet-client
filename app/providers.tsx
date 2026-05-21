"use client";

import {
  useCommentDeleteSubscription,
  useCommentSubscription,
  useFollowSubscription,
  useTweetCreateSubscription,
  useTweetDeleteSubscription,
  useTweetLikeSubscription,
} from "@/hooks/subscription";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "react-hot-toast";

const queryClient = new QueryClient();
function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  useTweetLikeSubscription();

  useCommentSubscription();

  useTweetCreateSubscription();

  useTweetDeleteSubscription();

  useCommentDeleteSubscription();

  useFollowSubscription();

  return <>{children}</>;
}

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
      <QueryClientProvider client={queryClient}>
        <SubscriptionProvider>{children}</SubscriptionProvider>
        <Toaster />
        <ReactQueryDevtools />
      </QueryClientProvider>
    </GoogleOAuthProvider>
  );
}
