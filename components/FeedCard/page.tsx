"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { generate } from "random-words";
import { BiMessage, BiMessageRounded, BiUpload } from "react-icons/bi";
import { FaRetweet } from "react-icons/fa";
import { FaHeart, FaMessage } from "react-icons/fa6";
import { GetAllTweetsQuery } from "@/gql/graphql";
import Link from "next/link";
import { graphqlClient } from "@/clients/api";
import {
  createCommentMutation,
  deleteCommentMutation,
  deleteTweetMutation,
  toggleLikeMutation,
} from "@/graphql/mutation/tweet";
import { useMutation } from "@tanstack/react-query";
import { MdDelete, MdDeleteSweep, MdOutlineWarning } from "react-icons/md";
import { useCurrentUser } from "@/hooks/user";
import toast from "react-hot-toast";
import { FiDelete } from "react-icons/fi";
import { AiFillDelete } from "react-icons/ai";
import { IoMdWarning } from "react-icons/io";
import { SiMessenger } from "react-icons/si";

interface FeedCardProps {
  data: NonNullable<GetAllTweetsQuery["getAllTweets"]>[0];
}

const FeedCard: React.FC<FeedCardProps> = (props) => {
  const { data } = props;
  const { user } = useCurrentUser();
  const [text, setText] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [liked, setLiked] = useState(false);

  const [isAnimatingLike, setIsAnimatingLike] = useState(false);

  const [comment, setComment] = useState("");
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [likeCooldown, setLikeCooldown] = useState(false);
  const [commentCooldown, setCommentCooldown] = useState(false);
  const [deleteCommentCooldown, setDeleteCommentCooldown] = useState(false);
  const [deleteTweetCooldown, setDeleteTweetCooldown] = useState(false);
  const likeMutation = useMutation({
    mutationFn: async () => {
      if (!user) {
        toast.error("You need to sign in for liking");
        return;
      }

      return graphqlClient.request(toggleLikeMutation, {
        tweetId: data?.id as string,
      });
    },

    onSuccess: async (response) => {
      if (!response) return;

      const isLiked = response.toggleLike ?? false;

      setLiked(isLiked);

      setIsAnimatingLike(true);

      if (isLiked) {
        toast.success("Tweet liked ❤️");
      } else {
        toast.success("Like removed 💔");
      }

      setTimeout(() => {
        setIsAnimatingLike(false);
      }, 400);
    },

    onError: () => {
      toast.error("Failed to like tweet");
    },
  });

  const commentMutation = useMutation({
    mutationFn: async () => {
      if (!user) {
        toast.error("Unauthorized");
        return;
      }

      return graphqlClient.request(createCommentMutation, {
        tweetId: data?.id as string,
        content: comment,
      });
    },

    onSuccess: async () => {
      toast.success("Comment added");

      setComment("");
    },

    onError: () => {
      toast.error("Failed to comment");
    },
  });

  const deleteCommentMutationHook = useMutation({
    mutationFn: async (commentId: string) => {
      const toastId = toast.loading("Deleting comment...");

      try {
        // smooth UX delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const response = await graphqlClient.request(deleteCommentMutation, {
          commentId,
        });

        toast.success("Comment deleted 🗑️", {
          id: toastId,
        });

        return response;
      } catch (error) {
        toast.error("Failed to delete comment", {
          id: toastId,
        });

        throw error;
      }
    },

    onSuccess: async () => {},
  });

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

    onSuccess: async () => {},
  });

  useEffect(() => {
    setText(generate({ exactly: 40, join: " " }));
  }, []);

  const handleDeleteTweet = async () => {
    if (deleteTweetCooldown) return;

    setDeleteTweetCooldown(true);

    setTimeout(() => {
      setDeleteTweetCooldown(false);
    }, 3000);
    await deleteMutation.mutateAsync();

    setShowDeleteModal(false);
  };

  const handleLike = async () => {
    if (likeCooldown) {
      toast.error("Please wait before liking again");
      return;
    }

    setLikeCooldown(true);

    setTimeout(() => {
      setLikeCooldown(false);
    }, 1000);
    await likeMutation.mutateAsync();
  };

  const handleComment = async () => {
    if (!comment.trim()) {
      if (commentCooldown) {
        toast.error("Please wait before commenting again");
        return;
      }

      setCommentCooldown(true);

      setTimeout(() => {
        setCommentCooldown(false);
      }, 5000);
      toast.error("Comment cannot be empty");
      return;
    }

    try {
      await commentMutation.mutateAsync();
    } catch (error: any) {
      const message = error?.response?.errors?.[0]?.message;

      if (message === "Please wait before commenting again") {
        toast.error("Please wait 5 seconds before commenting again");

        return;
      }

      toast.error("Failed to comment");
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      if (deleteCommentCooldown) return;

      setDeleteCommentCooldown(true);

      setTimeout(() => {
        setDeleteCommentCooldown(false);
      }, 2000);
      await deleteCommentMutationHook.mutateAsync(commentId);
    } catch {}
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
                disabled={deleteTweetCooldown || deleteMutation.isPending}
                onClick={handleDeleteTweet}
                className="
px-4 py-2
disabled:opacity-50
disabled:cursor-not-allowed
rounded-full

bg-red-500

text-white

hover:bg-red-400

hover:scale-105

transition-all duration-300
"
              >
                {deleteMutation.isPending
                  ? "Deleting..."
                  : deleteTweetCooldown
                    ? "Wait..."
                    : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showCommentBox && (
        <div
          className="
fixed inset-0

z-50

flex items-center justify-center

bg-black/70
backdrop-blur-sm
"
        >
          <div
            className="
bg-[#0f172a]

border border-slate-700

rounded-3xl

w-[95%]
max-w-2xl

max-h-[85vh]

overflow-y-auto

p-6

shadow-[0_0_40px_rgba(0,0,0,0.6)]
"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Comments</h2>

              <button
                onClick={() => setShowCommentBox(false)}
                className="
text-slate-400

hover:text-red-400

text-xl

transition-all duration-300
"
              >
                ✕
              </button>
            </div>

            <div className="mt-5 flex gap-2">
              <input
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write a comment..."
                className="
w-full

rounded-xl

bg-slate-900

border border-slate-700

px-4 py-2

text-sm text-white

outline-none

focus:border-sky-500
"
              />

              <button
                disabled={commentMutation.isPending || commentCooldown}
                onClick={handleComment}
                className="
px-4 py-2

rounded-xl

bg-sky-500

text-white

disabled:opacity-50
disabled:cursor-not-allowed
disabled:scale-95

hover:bg-sky-400

transition-all duration-300
"
              >
                {commentMutation.isPending
                  ? "Commenting..."
                  : commentCooldown
                    ? "Wait..."
                    : "Comment"}
              </button>
            </div>

            <div className="mt-6 space-y-4">
              {data?.comments?.map((comment: any) => (
                <div
                  key={comment?.id}
                  className="
rounded-2xl

bg-slate-900/70

border border-slate-800

p-4
"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Link
                        href={`/user/${comment?.author?.id}`}
                        className="
text-sm font-semibold

text-sky-400

hover:text-sky-300

hover:underline

transition-all duration-300
"
                      >
                        {comment?.author?.firstName} {comment?.author?.lastName}
                      </Link>

                      <div className="text-[10px] text-slate-500">
                        {comment?.createdAt &&
                        !isNaN(new Date(comment.createdAt).getTime())
                          ? new Date(comment.createdAt).toLocaleString(
                              "en-IN",
                              {
                                day: "numeric",
                                month: "short",
                                hour: "numeric",
                                minute: "2-digit",
                              },
                            )
                          : "..."}
                      </div>
                    </div>

                    {user?.id === comment?.author?.id && (
                      <div
                        onClick={() => {
                          if (
                            deleteCommentCooldown ||
                            deleteCommentMutationHook.isPending
                          ) {
                            return;
                          }

                          handleDeleteComment(comment.id);
                        }}
                        className={`
text-orange-300

cursor-pointer

hover:text-red-400

hover:scale-130

transition-all duration-300

${deleteCommentCooldown ? "opacity-40 pointer-events-none" : ""}
`}
                      >
                        <FiDelete size={14} />
                      </div>
                    )}
                  </div>

                  <div className="mt-2 text-sm text-slate-300">
                    {comment?.content}
                  </div>
                </div>
              ))}
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
            {data?.author?.profileImageUrl ? (
              <Image
                src={data.author.profileImageUrl}
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
            ) : (
              <div
                className="
h-10 w-10
sm:h-11 sm:w-11
md:h-12 md:w-12

rounded-full

bg-slate-700

animate-pulse

shrink-0
"
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
                href={`/user/${data?.author?.id}`}
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
                  {data?.createdAt && !isNaN(new Date(data.createdAt).getTime())
                    ? new Date(data.createdAt).toLocaleString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      })
                    : "..."}
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
                  width={600}
                  height={600}
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
                onClick={() => {
                  if (!user) {
                    toast.error("Unauthorized");
                    return;
                  }

                  setShowCommentBox(!showCommentBox);
                }}
                className="
hover:text-sky-400

hover:scale-125

transition-all duration-300

cursor-pointer
"
              >
                <div className="flex items-center gap-2">
                  <SiMessenger />

                  <span className="text-xs sm:text-sm">
                    {data?.comments?.length ?? 0}
                  </span>
                </div>
              </div>
              {/* <div
                className="hover:text-green-400

hover:scale-125

transition-all duration-300"
              >
                <FaRetweet />
              </div> */}

              <div
                onClick={() => {
                  if (likeCooldown || likeMutation.isPending) return;

                  handleLike();
                }}
                className={`
cursor-pointer

transition-all duration-300
${likeCooldown ? "opacity-50 cursor-not-allowed" : ""}

${liked ? "text-pink-500" : "text-slate-500"}

hover:text-pink-500

${isAnimatingLike ? "scale-150" : "hover:scale-125"}
`}
              >
                <div className="flex items-center gap-2">
                  <FaHeart />

                  <span className="text-xs sm:text-sm">
                    {likeMutation.isPending ? "..." : (data?.likesCount ?? 0)}
                  </span>
                </div>
              </div>

              {user?.id === data?.author?.id && (
                <div
                  onClick={() => setShowDeleteModal(true)}
                  className="
      text-red-100
      cursor-pointer

      hover:text-red-400
      hover:scale-170

      transition-all duration-200
    "
                >
                  <MdDeleteSweep />
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
