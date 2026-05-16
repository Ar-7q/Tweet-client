// import Twitterlayout from "@/components/FeedCard/Layout/TwiiterLayout";
"use client";
import TwitterLayout from "@/components/FeedCard/Layout/TwitterLayout";
import FeedCard from "@/components/FeedCard/page";
import { useCurrentUser, useGetUserById } from "@/hooks/user";
import { log } from "console";

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { BsArrowLeftCircleFill } from "react-icons/bs";

const UserProfilePage = () => {
  // const { user } = useCurrentUser();
  const params = useParams();

  const { user, isLoading } = useGetUserById(params.id as string);
  const router = useRouter();

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
  console.log(router);

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
              <Image
                src={user?.profileImageUrl}
                alt="user-image"
                className="rounded-full"
                width={100}
                height={100}
              />
            )}
            <h1 className="text-2xl font-bold mt-5">
              {user?.firstName} {user?.lastName}
            </h1>
          </div>
          <div>
            {user?.tweets?.map((tweet) => (
              <FeedCard data={tweet} key={tweet?.id} />
            ))}
          </div>
        </div>
      </TwitterLayout>
    </div>
  );
};

export default UserProfilePage;
