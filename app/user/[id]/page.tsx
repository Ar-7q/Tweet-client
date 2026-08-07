// import Twitterlayout from "@/components/FeedCard/Layout/TwiiterLayout";
"use client";
import { graphqlClient } from "@/clients/api";
import TwitterLayout from "@/components/FeedCard/Layout/TwitterLayout";
import FeedCard from "@/components/FeedCard/page";
import { followUserMutation, unfollowUserMutation } from "@/graphql/mutation/user";
import { verifyGoogleTokenQuery } from "@/graphql/query/user";
import { useGetAllTweets } from "@/hooks/tweet";
import { useCurrentUser, useGetUserById } from "@/hooks/user";
import { getCooldownRemaining, isCooldownActive, startCooldown } from "@/utils/cooldown";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { BsArrowLeftCircleFill } from "react-icons/bs";

const UserProfilePage = () => {
  const { user: currentUser } = useCurrentUser();
  const params = useParams();
  const { refetch } = useGetAllTweets();

  const { user, isLoading } = useGetUserById(params.id as string);
  const router = useRouter();
  const queryClient = useQueryClient();
  const isOwnProfile = currentUser?.id === user?.id;
  const isFollowing = user?.followers?.some((follower) => follower?.follower?.id === currentUser?.id);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [followCooldown, setFollowCooldown] = useState(0);
  const followMutation = useMutation({
    mutationFn: async () => {
      if (!currentUser) {
        toast.error("Please sign in first");
        return;
      }

      return graphqlClient.request(followUserMutation, {
        to: user?.id as string,
      });
    },

    onSuccess: async (response) => {
      if (!response) return;

      toast.success("User followed");

      await queryClient.invalidateQueries({
        queryKey: ["current-user"],
      });
      await queryClient.invalidateQueries({
        queryKey: ["user-by-id", user?.id],
      });
      await queryClient.refetchQueries({
        queryKey: ["current-user"],
      });
    },

    onError: () => {
      toast.error("Failed to follow");
    },
  });

  const unfollowMutation = useMutation({
    mutationFn: async () => {
      if (!currentUser) {
        toast.error("Please sign in first");
        return;
      }

      return graphqlClient.request(unfollowUserMutation, {
        to: user?.id as string,
      });
    },

    onSuccess: async (response) => {
      if (!response) return;

      toast.success("User unfollowed");

      await queryClient.invalidateQueries({
        queryKey: ["current-user"],
      });
      await queryClient.invalidateQueries({
        queryKey: ["user-by-id", user?.id],
      });
      await queryClient.refetchQueries({
        queryKey: ["current-user"],
      });
    },

    onError: () => {
      toast.error("Failed to unfollow");
    },
  });

  const handleLoginwithGoogle = useCallback(
    async (cred: CredentialResponse) => {
      const googleToken = cred.credential;
      if (!googleToken) return toast.error(`Google token not found`);

      const { verifyGoogleToken } = await graphqlClient.request(verifyGoogleTokenQuery, { token: googleToken });

      toast.success(`Verified Success`);
      console.log(verifyGoogleToken);
      if (verifyGoogleToken) {
        window.localStorage.setItem("_tweet_token", verifyGoogleToken);
      }

      await queryClient.invalidateQueries({
        queryKey: ["current-user"],
      });
    },
    [queryClient],
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setFollowCooldown(getCooldownRemaining(`follow:${currentUser?.id}`));
    }, 1000);

    return () => clearInterval(interval);
  }, [currentUser]);

  if (isLoading) {
    return (
      <TwitterLayout>
        <div className="animate-pulse p-5 space-y-5">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-slate-700" />

            <div className="space-y-2">
              <div className="h-4 w-40 bg-slate-700 rounded" />
              <div className="h-3 w-24 bg-slate-800 rounded" />
            </div>
          </div>

          <div className="space-y-4 mt-10">
            <div className="h-24 bg-slate-800 rounded-xl" />
            <div className="h-24 bg-slate-800 rounded-xl" />
            <div className="h-24 bg-slate-800 rounded-xl" />
          </div>
        </div>
      </TwitterLayout>
    );
  }

  if (!user) {
    return (
      <TwitterLayout>
        <div className="flex flex-col items-center justify-center h-screen text-center px-4">
          <h1 className="text-3xl font-bold text-white">Sign in to view your profile</h1>

          <p className="text-slate-400 mt-3 mb-6">Login with Google to access your profile.</p>

          <GoogleLogin
            onSuccess={handleLoginwithGoogle}
            onError={() => toast.error("Google Login Failed")}
            useOneTap={false}
            ux_mode="popup"
          />
        </div>
      </TwitterLayout>
    );
  }

  console.log(params.id);
  const handleProfileRefresh = async () => {
    setIsRefreshing(true);

    router.refresh();

    setTimeout(() => {
      setIsRefreshing(false);
    }, 1200);
  };

  return (
    <div>
      <TwitterLayout>
        <div>
          <nav className="py-3 px-3 border-b border-slate-800">
            {/* Top Row */}
            <div className="flex items-center gap-3">
              <BsArrowLeftCircleFill
                onClick={() => router.back()}
                className="
text-4xl

cursor-pointer

hover:scale-110

transition-all duration-200
"
              />

              <div>
                <h1 className="text-2xl font-bold">
                  {user?.firstName} {user?.lastName}
                </h1>

                <p className="text-slate-400 text-sm">{user?.tweets?.length || 0} Tweets</p>
              </div>
            </div>

            {/* Stats */}
            <div
              className="
flex items-center

gap-8

mt-5

flex-wrap
"
            >
              <div className="flex flex-col items-center">
                <span className="text-white font-bold text-lg">{user?.followers?.length || 0}</span>

                <span className="text-slate-400 text-sm">Followers</span>
              </div>

              <div className="flex flex-col items-center">
                <span className="text-white font-bold text-lg">{user?.following?.length || 0}</span>

                <span className="text-slate-400 text-sm">Following</span>
              </div>
            </div>

            {/* Follow Button */}
            {!isOwnProfile && (
              <button
                disabled={followMutation.isPending || unfollowMutation.isPending}
                onClick={() => {
                  if (!currentUser) {
                    toast.error("Please sign in first");
                    return;
                  }

                  if (isCooldownActive(`follow:${currentUser?.id}`)) {
                    toast.error(`Please wait ${getCooldownRemaining(`follow:${currentUser?.id}`)}s`);

                    return;
                  }

                  startCooldown(`follow:${currentUser?.id}`, 30);

                  if (isFollowing) {
                    unfollowMutation.mutate();
                  } else {
                    followMutation.mutate();
                  }
                }}
                className="mt-5 px-8 py-2.5 rounded-full font-semibold text-white bg-gradient-to-r from-sky-500 to-cyan-400 hover:scale-105 hover:shadow-[0_0_25px_rgba(56,189,248,0.45)] transition-all duration-300 disabled:opacity-50"
              >
                {followMutation.isPending || unfollowMutation.isPending
                  ? "Loading..."
                  : followCooldown > 0
                    ? `${followCooldown}s`
                    : isFollowing
                      ? "Unfollow"
                      : "Follow"}
              </button>
            )}
          </nav>
          <div className="p-4 border-b border-amber-950">
            {user?.profileImageUrl && (
              <div onClick={handleProfileRefresh} className="relative w-fit cursor-pointer group">
                {isOwnProfile && (
                  <>
                    <div
                      className="
absolute inset-[-10px]

rounded-full

bg-gradient-to-r
from-pink-500
via-sky-400
to-violet-500

opacity-70

blur-2xl

animate-spinSlow
"
                    />

                    <div
                      className="
absolute inset-[-4px]

rounded-full

border-[3px]

border-transparent

bg-gradient-to-r
from-pink-500
via-cyan-400
to-purple-500

animate-pulse
"
                    />
                  </>
                )}

                <Image
                  src={user?.profileImageUrl}
                  alt="user-image"
                  className="
relative z-10

rounded-full

border-4 border-slate-900
animate-floatProfile
hover:scale-105

hover:shadow-[0_0_45px_rgba(168,85,247,0.55)]

hover:rotate-1

transition-all duration-500
"
                  width={100}
                  height={100}
                />

                {isRefreshing && (
                  <div
                    className="
absolute inset-0

flex items-center justify-center

z-20
"
                  >
                    <div
                      className="
w-8 h-8

border-4
border-white/30
border-t-white

rounded-full

animate-spin
"
                    />
                  </div>
                )}
              </div>
            )}
            <h1 className="text-2xl font-bold mt-5">
              {user?.firstName} {user?.lastName}
            </h1>
          </div>
          <div>
            {user?.tweets
              ?.filter((tweet) => tweet !== null)
              ?.slice()
              ?.sort((a, b) => new Date(b?.createdAt || "").getTime() - new Date(a?.createdAt || "").getTime())
              ?.map((tweet) => (
                <FeedCard data={tweet} key={tweet?.id} />
              ))}
          </div>
        </div>
      </TwitterLayout>
    </div>
  );
};

export default UserProfilePage;
