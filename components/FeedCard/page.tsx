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
  const [showDeleteModal, setShowDeleteModal] = useState(false);

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

  const handleDeleteTweet = async () => {
    await deleteMutation.mutateAsync();

    setShowDeleteModal(false);
  };

  return (
    <div>
      {showDeleteModal && (
        <div
          className="
fixed inset-0

z-50

flex items-center justify-center

bg-black/70
backdrop-blur-sm

animate-fadeIn
"
        >
          <div
            className="
bg-[#0f172a]

border border-slate-700

rounded-3xl

p-6

w-[90%]
max-w-md

shadow-[0_0_40px_rgba(0,0,0,0.6)]

animate-scaleIn
"
          >
            <h2
              className="
text-xl font-bold

text-white
"
            >
              Delete Tweet?
            </h2>

            <p
              className="
text-slate-400

mt-2
"
            >
              Are you sure you want to permanently delete this tweet?
            </p>

            <div
              className="
flex justify-end gap-3

mt-6
"
            >
              <button
                onClick={() => setShowDeleteModal(false)}
                className="
px-4 py-2

rounded-full

bg-slate-800

text-white

hover:bg-slate-700

transition-all duration-300
"
              >
                Cancel
              </button>

              <button
                onClick={handleDeleteTweet}
                className="
px-4 py-2

rounded-full

bg-red-500

text-white

hover:bg-red-400

hover:scale-105

transition-all duration-300
"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      <div
        className="
group
hover:-translate-y-[2px]

border border-r-0 border-l-0 border-b-0 border-gray-800

px-2 sm:px-4 md:px-5
py-4 sm:py-5

hover:bg-slate-900/70

backdrop-blur-md

hover:shadow-[0_0_30px_rgba(56,189,248,0.08)]

hover:border-sky-500/20

transition-all duration-500



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

ring-2 ring-transparent

group-hover:ring-sky-400/40

group-hover:scale-105

transition-all duration-300

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
            <div
              className="
flex items-center flex-wrap gap-2

mb-2
"
            >
              <Link
                href={`/${data?.author?.id}`}
                className="
font-semibold

text-sm sm:text-base md:text-lg

text-slate-100

group-hover:text-sky-400

hover:underline

transition-all duration-300
"
              >
                {data?.author?.firstName} {data?.author?.lastName}
              </Link>

              {data?.createdAt && (
                <div
                  className="
px-3 py-1

rounded-full

bg-slate-800/80
backdrop-blur-md

border border-slate-700

text-[10px] sm:text-xs

text-slate-400

shadow-[0_0_15px_rgba(56,189,248,0.08)]

hover:border-sky-500/30
hover:text-sky-300

hover:scale-105

transition-all duration-300
"
                >
                  {new Date(Number(data.createdAt)).toLocaleString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </div>
              )}
            </div>

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
rounded-3xl

w-full

max-h-[500px]

object-cover

border border-slate-700

hover:scale-[1.01]

hover:brightness-110

hover:shadow-[0_0_30px_rgba(56,189,248,0.15)]

transition-all duration-500
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

text-slate-500
"
            >
              <div
                className="hover:text-sky-400

hover:scale-125

transition-all duration-300"
              >
                <BiMessageRounded />
              </div>

              <div
                className="hover:text-green-400

hover:scale-125

transition-all duration-300"
              >
                <FaRetweet />
              </div>

              <div
                className="
hover:text-pink-500

hover:scale-125

transition-all duration-300
"
              >
                <FaHeart />
              </div>

              <div
                className="hover:text-yellow-400

hover:scale-125

transition-all duration-300"
              >
                <BiUpload />
              </div>

              {user?.id === data?.author?.id && (
                <div
                  onClick={() => setShowDeleteModal(true)}
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
