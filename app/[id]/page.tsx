// import Twitterlayout from "@/components/FeedCard/Layout/TwiiterLayout";
"use client";
import TwitterLayout from "@/components/FeedCard/Layout/TwitterLayout";
import FeedCard from "@/components/FeedCard/page";
import { useGetAllTweets } from "@/hooks/tweet";
import { useCurrentUser, useGetUserById } from "@/hooks/user";

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { BsArrowLeftCircleFill } from "react-icons/bs";

const UserProfilePage = () => {
  const { user: currentUser } = useCurrentUser();
  const params = useParams();
  const { refetch } = useGetAllTweets();

  const { user, isLoading } = useGetUserById(params.id as string);
  const router = useRouter();
  const isOwnProfile = currentUser?.id === user?.id;
  const [isRefreshing, setIsRefreshing] = useState(false);

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
          <h1 className="text-3xl font-bold text-white">User Not Found</h1>

          <p className="text-slate-400 mt-3 text-sm sm:text-base">
            The profile you are looking for does not exist.
          </p>

          <button
            onClick={() => router.push("/")}
            className="
              mt-6
              bg-blue-500
              hover:bg-blue-600
              transition-all
              px-5 py-2
              rounded-full
              font-semibold
            "
          >
            Go Home
          </button>
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
          <nav className="flex items-center gap-3 py-3 px-3">
            <BsArrowLeftCircleFill
              onClick={() => router.back()}
              className="
    text-4xl
    cursor-pointer
    hover:scale-110
    transition-all
    duration-200
  "
            />
            <div>
              <h1 className="text-2xl font-semibold font-sans">
                {user?.firstName} {user?.lastName}
              </h1>
              <h1 className="text-md font-bold text-slate-500">
                {user?.tweets?.length || 0} Tweets
              </h1>
            </div>
          </nav>
          <div className="p-4 border-b border-amber-950">
            {user?.profileImageUrl && (
              <div
                onClick={handleProfileRefresh}
                className="
relative

w-fit

cursor-pointer

group
"
              >
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
              ?.slice()
              ?.sort((a, b) => Number(b?.createdAt) - Number(a?.createdAt))
              ?.map((tweet) => (
                <FeedCard data={tweet} key={tweet?.id} refetch={refetch} />
              ))}
          </div>
        </div>
      </TwitterLayout>
    </div>
  );
};

export default UserProfilePage;
