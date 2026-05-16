"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { generate } from "random-words";
import { BiMessageRounded, BiUpload } from "react-icons/bi";
import { FaRetweet } from "react-icons/fa";
import { FaHeart } from "react-icons/fa6";
import { GetAllTweetsQuery } from "@/gql/graphql";

interface FeedCardProps {
  data: NonNullable<GetAllTweetsQuery["getAllTweets"]>[0];
}

const FeedCard: React.FC<FeedCardProps> = (props) => {
  const { data } = props;
  const [text, setText] = useState("");

  useEffect(() => {
    setText(generate({ exactly: 40, join: " " }));
  }, []);

  return (
    <div>
      <div
        className="
border border-r-0 border-l-0 border-b-0 border-gray-700

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
            {data?.author?.profileImageUrl && (
              <Image
                src={data?.author.profileImageUrl}
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
            <h5
              className="
font-semibold

text-sm sm:text-base md:text-lg

truncate

text-slate-100
"
            >
              {data?.author?.firstName} {data?.author?.lastName}
            </h5>

            <p
              className="
text-xs sm:text-sm md:text-base

break-words whitespace-pre-wrap

text-slate-300

mt-1 leading-relaxed

overflow-hidden
"
            >
              {data?.content}
            </p>

            <div
              className="
flex items-center justify-between

mt-3 sm:mt-4

text-sm sm:text-lg md:text-xl

px-1 sm:px-2 py-1

w-full

max-w-[320px] sm:max-w-[420px]

text-slate-400
"
            >
              <div>
                <BiMessageRounded />
              </div>

              <div>
                <FaRetweet />
              </div>

              <div>
                <FaHeart />
              </div>

              <div>
                <BiUpload />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedCard;
