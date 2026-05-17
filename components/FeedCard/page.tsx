"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { generate } from "random-words";
import { BiMessageRounded, BiUpload } from "react-icons/bi";
import { FaRetweet } from "react-icons/fa";
import { FaHeart } from "react-icons/fa6";
import { GetAllTweetsQuery } from "@/gql/graphql";
import Link from "next/link";
import { graphqlClient } from "@/clients/api";
import { deleteTweetMutation } from "@/graphql/mutation/tweet";
import { useMutation } from "@tanstack/react-query";
import { MdDelete } from "react-icons/md";
import { useCurrentUser } from "@/hooks/user";
import toast from "react-hot-toast";

interface FeedCardProps {
  data: NonNullable<GetAllTweetsQuery["getAllTweets"]>[0];
  refetch: () => void;
}

const FeedCard: React.FC<FeedCardProps> = (props) => {
  const { data, refetch } = props;
  const { user } = useCurrentUser();
  const [text, setText] = useState("");

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const toastId = toast.loading("Deleting tweet...");

      try {
        const response = await graphqlClient.request(deleteTweetMutation, {
          tweetId: data?.id as string,
        });

        toast.success("Tweet deleted successfully 🗑️", {
          id: toastId,
        });

        return response;
      } catch (error) {
        toast.error("Failed to delete tweet", {
          id: toastId,
        });

        throw error;
      }
    },

    onSuccess: async () => {
      await refetch();
    },
  });

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
              <Link href={`/${data?.author?.id}`}>
                {data?.author?.firstName} {data?.author?.lastName}
              </Link>
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

            {data?.imageURL && (
              <div className="mt-4">
                <Image
                  src={data.imageURL}
                  alt="tweet-image"
                  width={700}
                  height={700}
                  className="
        rounded-2xl

        w-full

        max-h-[500px]

        object-cover

        border border-slate-700
      "
                />
              </div>
            )}

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

              {user?.id === data?.author?.id && (
                <div
                  onClick={() => deleteMutation.mutate()}
                  className="
      text-red-500
      cursor-pointer

      hover:text-red-400
      hover:scale-110

      transition-all duration-200
    "
                >
                  <MdDelete />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedCard;
