"use client";

import TwitterLayout from "@/components/FeedCard/Layout/TwitterLayout";
import FeedCard from "@/components/FeedCard/page";

import { useCreateTweet, useGetAllTweets } from "@/hooks/tweet";
import { useCurrentUser } from "@/hooks/user";

import Image from "next/image";

import React, { useCallback, useState } from "react";
import { BiImageAdd } from "react-icons/bi";

export default function Home() {
  const { user } = useCurrentUser();
  const { tweets = [],isLoading } = useGetAllTweets();
  const { mutate } = useCreateTweet();

  // console.log(user);

  const [content, setContent] = useState("");

  const handleSelectImage = useCallback(() => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();
  }, []);

  const handleCreateTweet = useCallback(() => {
    mutate({
      content,
    });
  }, [content, mutate]);
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

  return (
    <div>
      <TwitterLayout>
        <div>
          <div
            className="
border border-r-0 border-l-0 border-b-0
border-gray-700

px-2 sm:px-4 md:px-5
py-3 sm:py-4

hover:bg-slate-900/80

transition-all duration-300

cursor-pointer

w-full overflow-hidden
"
          >
            <div
              className="
grid grid-cols-12

gap-2 sm:gap-3

w-full min-w-0
"
            >
              <div
                className="
col-span-2 sm:col-span-1

flex justify-center sm:justify-start

min-w-0
"
              >
                {user?.profileImageUrl && (
                  <Image
                    src={user?.profileImageUrl}
                    alt="user-image"
                    className="
rounded-full

h-10 w-10
sm:h-11 sm:w-11
md:h-12 md:w-12

object-cover
shrink-0
"
                    height={50}
                    width={50}
                  />
                )}
              </div>
              <div
                className="
col-span-10 sm:col-span-11

min-w-0 overflow-hidden
"
              >
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="
w-full

bg-transparent

text-base sm:text-lg md:text-xl

px-2 sm:px-3
py-2

border-b border-slate-700

outline-none

resize-none

placeholder:text-slate-500

overflow-hidden
"
                  placeholder="What's the Mood?"
                  rows={4}
                ></textarea>

                <div
                  className="
mt-3

flex items-center justify-between

gap-3

w-full
"
                >
                  <BiImageAdd
                    onClick={handleSelectImage}
                    className="
text-lg sm:text-xl md:text-2xl

text-sky-400

cursor-pointer

hover:scale-110

transition-all duration-200
"
                  />
                  <button
                    onClick={handleCreateTweet}
                    className="
bg-sky-400

text-black

font-bold

text-xs sm:text-sm md:text-base

py-2 px-4 sm:px-5

rounded-full

cursor-pointer

hover:scale-105
hover:bg-sky-300

transition-all duration-300

whitespace-nowrap
"
                  >
                    Bang..🌞
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        {tweets?.map((tweet) =>
          tweet ? <FeedCard key={tweet?.id} data={tweet} /> : null,
        )}
      </TwitterLayout>
    </div>
  );
}
