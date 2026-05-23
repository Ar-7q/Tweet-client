"use client";
import {
  BsBookmarkHeart,
  BsFillBellFill,
  BsFillEnvelopeDashFill,
} from "react-icons/bs";

import {
  BiHash,
  BiHomeCircle,
  BiImageAdd,
  BiMoney,
  BiSolidUser,
} from "react-icons/bi";
import { useCurrentUser } from "@/hooks/user";
import { CgOptions } from "react-icons/cg";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { graphqlClient } from "@/clients/api";
import { verifyGoogleTokenQuery } from "@/graphql/query/user";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";

import toast from "react-hot-toast";
import { useCallback, useEffect, useMemo, useState } from "react";

import Image from "next/image";
import { FaTwitch } from "react-icons/fa";

import Link from "next/link";
import { useRouter } from "next/navigation";
import LogoutButton from "@/components/LogoutButton";
import { useGetAllTweets } from "@/hooks/tweet";
import { deleteCommentMutation } from "@/graphql/mutation/tweet";
import { MdDeleteOutline } from "react-icons/md";
interface TwitterSidebarButton {
  title: string;
  icon: React.ReactNode;
  link: string;
}

interface TwitterLayoutProps {
  children: React.ReactNode;
}

const TwitterLayout: React.FC<TwitterLayoutProps> = (props) => {
  const { user } = useCurrentUser();
  const queryClient = useQueryClient();

  const router = useRouter();

  const { tweets = [] } = useGetAllTweets();

  const [openFollowingModal, setOpenFollowingModal] = useState(false);

  const [searchFollowing, setSearchFollowing] = useState("");
  const [openFollowersModal, setOpenFollowersModal] = useState(false);

  const [searchFollowers, setSearchFollowers] = useState("");

  const [openMessagesModal, setOpenMessagesModal] = useState(false);

  const [openNotificationsModal, setOpenNotificationsModal] = useState(false);

  const [clearedNotifications, setClearedNotifications] = useState<string[]>(
    () => {
      if (typeof window !== "undefined") {
        return JSON.parse(
          localStorage.getItem("cleared-notifications") || "[]",
        );
      }

      return [];
    },
  );

  const [clearedMessages, setClearedMessages] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      return JSON.parse(localStorage.getItem("cleared-messages") || "[]");
    }

    return [];
  });

  const notifications = useMemo(() => {
    const followNotifications =
      user?.followers?.map((follow: any) => ({
        type: "follow",

        id: follow?.id,

        // createdAt: Date.now(),
        createdAt: follow?.createdAt || Date.now(),
        author: follow?.follower,
      })) || [];

    return [...followNotifications]?.sort(
      (a: any, b: any) =>
        new Date(b?.createdAt).getTime() - new Date(a?.createdAt).getTime(),
    );
  }, [tweets, user]);

  const notificationCount = notifications?.length || 0;

  const [seenNotificationsCount, setSeenNotificationsCount] = useState(() => {
    if (typeof window !== "undefined") {
      return Number(localStorage.getItem("seen-notifications")) || 0;
    }

    return 0;
  });

  const unreadNotificationsCount = notificationCount - seenNotificationsCount;

  const messages =
    tweets?.flatMap((tweet: any) =>
      tweet?.author?.id === user?.id
        ? tweet?.comments
            ?.filter((c: any) => c?.author?.id !== user?.id)
            ?.map((c: any) => ({
              ...c,
              tweetAuthor: tweet?.author,
            }))
        : [],
    ) || [];

  const [seenMessagesCount, setSeenMessagesCount] = useState(() => {
    if (typeof window !== "undefined") {
      return Number(localStorage.getItem("seen-messages")) || 0;
    }

    return 0;
  });

  const unreadMessagesCount = messages.length - seenMessagesCount;
  useEffect(() => {
    localStorage.setItem(
      "cleared-notifications",
      JSON.stringify(clearedNotifications),
    );
  }, [clearedNotifications]);

  useEffect(() => {
    localStorage.setItem("cleared-messages", JSON.stringify(clearedMessages));
  }, [clearedMessages]);

  useEffect(() => {
    localStorage.setItem("seen-notifications", String(seenNotificationsCount));
  }, [seenNotificationsCount]);

  useEffect(() => {
    localStorage.setItem("seen-messages", String(seenMessagesCount));
  }, [seenMessagesCount]);

  const deleteCommentMutationHook = useMutation({
    mutationFn: async (commentId: string) => {
      const toastId = toast.loading("Deleting comment...");

      try {
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

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["all-tweets"],
      });
    },
  });

  const sidebarMenuItems: TwitterSidebarButton[] = useMemo(
    () => [
      {
        title: "Home",
        icon: <BiHomeCircle />,
        link: "/",
      },
      {
        title: "Explore",
        icon: <BiHash />,
        link: "/explore",
      },
      {
        title: "Notifications",
        icon: <BsFillBellFill />,
        link: "#notifications",
      },
      {
        title: "Messages",
        icon: <BsFillEnvelopeDashFill />,
        link: "#messages",
      },

      {
        title: "Profile",
        icon: <BiSolidUser />,
        link: `/user/${user?.id}`,
      },
    ],
    [user?.id],
  );

  const handleLoginwithGoogle = useCallback(
    async (cred: CredentialResponse) => {
      const googleToken = cred.credential;
      if (!googleToken) return toast.error(`Google token not found`);

      const { verifyGoogleToken } = await graphqlClient.request(
        verifyGoogleTokenQuery,
        { token: googleToken },
      );

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

  return (
    <div>
      <div
        className="
grid grid-cols-12 min-w-0 max-w-[1700px] mx-auto
h-screen w-full overflow-hidden

px-0 sm:px-2 md:px-4 lg:px-10 xl:px-20
"
      >
        <div
          className="
col-span-2 md:col-span-2 lg:col-span-3 xl:col-span-2

h-screen sticky top-0

pt-2 px-1 sm:px-2 md:px-4

flex flex-col items-center lg:items-start

min-w-[70px] md:min-w-[90px] lg:min-w-[220px]

relative overflow-hidden
"
        >
          {/* twitter image from react icons */}
          <div className="text-2xl h-fit w-fit hover:bg-gray-800 rounded-full p-4 cursor-pointer transition-all">
            <FaTwitch />
          </div>
          <div className="mt-2 text-sm sm:text-base md:text-lg xl:text-xl pr-2 md:pr-4">
            <ul>
              {sidebarMenuItems.map((item) => (
                <li key={item.title}>
                  <div
                    onClick={() => {
                      if (item.title === "Notifications") {
                        if (!user) {
                          toast.error("Please login first");
                          return;
                        }

                        setOpenNotificationsModal(true);

                        // setSeenNotificationsCount(notificationCount);
                        setSeenNotificationsCount(notifications.length);

                        return;
                      }

                      if (item.title === "Messages") {
                        if (!user) {
                          toast.error("Please login first");
                          return;
                        }

                        setOpenMessagesModal(true);
                        setSeenMessagesCount(messages.length);

                        return;
                      }

                      router.push(item.link);
                    }}
                    className="
flex justify-center lg:justify-start
items-center

gap-2 md:gap-4

hover:bg-gray-600 rounded-full

px-2 sm:px-3
py-2 md:py-3

cursor-pointer
w-full lg:w-fit

mt-2 transition-all
"
                  >
                    <div className="relative">
                      <span className="text-xl sm:text-2xl md:text-3xl">
                        {item.icon}
                      </span>

                      {item.title === "Notifications" &&
                        unreadNotificationsCount > 0 && (
                          <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-red-500 border border-black shadow-[0_0_10px_rgba(239,68,68,0.9)] animate-pulse" />
                        )}

                      {item.title === "Messages" && unreadMessagesCount > 0 && (
                        <div
                          className="
absolute

-top-1
-right-1

w-3
h-3

rounded-full

bg-red-500

border border-black

shadow-[0_0_10px_rgba(239,68,68,0.9)]

animate-pulse
"
                        />
                      )}
                    </div>

                    <span className="hidden lg:block whitespace-nowrap">
                      {item.title}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-5 px-3">
              <div className="mt-5 px-3">{user && <LogoutButton />}</div>
            </div>
          </div>
          {user && (
            <div
              className="
absolute bottom-4

left-1/2 -translate-x-1/2
lg:left-0 lg:translate-x-0 lg:bottom-5

group flex items-center gap-2 sm:gap-3

px-2 sm:px-4
py-2.5

w-[90%]
sm:w-fit

min-w-[72px]
sm:min-w-[220px]

rounded-2xl

border border-white/10
bg-white/10 backdrop-blur-xl

shadow-[0_8px_30px_rgb(0,0,0,0.25)]
hover:shadow-[0_12px_40px_rgb(59,130,246,0.25)]

transition-all duration-300 ease-out

hover:bg-white/15

animate-[fadeInUp_0.6s_ease]

overflow-hidden
"
            >
              <div
                className="
        absolute inset-0 rounded-2xl
        bg-gradient-to-r from-blue-500/10 via-cyan-400/10 to-purple-500/10
        opacity-0 group-hover:opacity-100
        transition-opacity duration-500
      "
              />

              {/* Profile Image */}
              {user.profileImageUrl && (
                <div className="relative shrink-0">
                  <div
                    className="
            absolute inset-0 rounded-full
            bg-blue-500/30 blur-md
            opacity-70 group-hover:opacity-100
            transition
          "
                  />

                  <Image
                    className="
            relative rounded-full object-cover
            border-2 border-white/20

            h-11 w-11
            sm:h-12 sm:w-12
            md:h-14 md:w-14

            transition-transform duration-300
            group-hover:scale-105
          "
                    src={user.profileImageUrl}
                    alt="user-image"
                    height={56}
                    width={56}
                  />
                </div>
              )}

              {/* User Info */}
              <div
                className="
hidden lg:flex
flex-col

overflow-hidden
min-w-0
"
              >
                <h3
                  className="
    text-sm sm:text-base md:text-lg

    font-light
    uppercase

    tracking-[0.35em]

    text-stone-200
    truncate

    font-serif

    max-w-[130px]
    md:max-w-[190px]

    opacity-95
  "
                >
                  {user.firstName} {user.lastName}
                </h3>
              </div>

              {/* Online Indicator */}
              <div className="flex items-center gap-1.5 ml-1">
                <span className="relative flex h-2.5 w-2.5">
                  <span
                    className="
            animate-ping absolute inline-flex h-full w-full
            rounded-full bg-emerald-400 opacity-75
          "
                  />
                  <span
                    className="
            relative inline-flex rounded-full
            h-2.5 w-2.5 bg-emerald-400
          "
                  />
                </span>

                <span className="hidden md:block text-[11px] text-emerald-300">
                  Active
                </span>
              </div>
            </div>
          )}
        </div>

        <div
          className="
feed-container

col-span-10 md:col-span-10 lg:col-span-5 xl:col-span-7

h-screen overflow-y-auto

scrollbar-thin
scrollbar-thumb-gray-700
scrollbar-track-transparent
hover:scrollbar-thumb-gray-600

scroll-smooth

w-full min-w-0

border-l border-r border-gray-700
"
        >
          {props.children}
        </div>

        <div
          className="
hidden lg:block
lg:col-span-4
xl:col-span-3

p-3 xl:p-5

space-y-5
"
        >
          {!user ? (
            <div className="p-5 bg-slate-700 rounded-lg">
              <h1 className="my-2 text-2xl">New User 🧰</h1>

              <GoogleLogin onSuccess={handleLoginwithGoogle} />
            </div>
          ) : (
            <div
              className="
sticky top-4
max-h-[95vh] overflow-y-auto

bg-black/70

border border-slate-800

rounded-2xl

p-5

backdrop-blur-xl

shadow-[0_0_25px_rgba(56,189,248,0.08)]
"
            >
              <h1
                className="
text-2xl

font-bold

mb-5

bg-gradient-to-r
from-sky-400
to-cyan-300

bg-clip-text
text-transparent
"
              >
                Recommended Users
              </h1>

              <div className="space-y-4">
                {user?.recommendedUsers?.length ? (
                  user.recommendedUsers.map((u) => (
                    <div
                      key={u?.id}
                      onClick={() => router.push(`/user/${u?.id}`)}
                      className="
flex items-center gap-3

cursor-pointer

hover:bg-slate-900/80

p-3

rounded-2xl

transition-all duration-300

hover:scale-[1.02]

group
"
                    >
                      <Image
                        src={u?.profileImageUrl || ""}
                        alt="recommended-user"
                        width={55}
                        height={55}
                        className="
rounded-full

border border-slate-700

object-cover

group-hover:scale-105

transition-all duration-300
"
                      />

                      <div className="overflow-hidden">
                        <h1
                          className="
font-semibold

text-white

truncate
"
                        >
                          {u?.firstName} {u?.lastName}
                        </h1>

                        <p
                          className="
text-sm

text-slate-400
"
                        >
                          Suggested for you
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-slate-500 text-sm">
                    No recommendations yet
                  </div>
                )}
              </div>

              <div
                onClick={() => setOpenFollowersModal(true)}
                className="
mt-6

bg-black/70

border border-slate-800

rounded-2xl

p-5

backdrop-blur-xl

shadow-[0_0_25px_rgba(56,189,248,0.08)]

cursor-pointer

hover:border-sky-500/40

transition-all duration-300
"
              >
                <h1
                  className="
text-2xl

font-bold

mb-3

bg-gradient-to-r
from-sky-400
to-cyan-300

bg-clip-text
text-transparent
"
                >
                  Your Followers ({user?.followers?.length || 0})
                </h1>

                <p className="text-slate-400 text-sm">
                  Click to view followers list
                </p>

                <div className="mt-4 flex -space-x-3">
                  {user?.followers?.slice(0, 5).map((f) => (
                    <Image
                      key={f?.follower?.id}
                      src={f?.follower?.profileImageUrl || ""}
                      alt="followers-preview"
                      width={45}
                      height={45}
                      className="
rounded-full

border-2 border-black

object-cover
"
                    />
                  ))}
                </div>
              </div>
              <div
                onClick={() => setOpenFollowingModal(true)}
                className="
mt-6

bg-black/70

border border-slate-800

rounded-2xl

p-5

backdrop-blur-xl

shadow-[0_0_25px_rgba(168,85,247,0.08)]

cursor-pointer

hover:border-pink-500/40

transition-all duration-300
"
              >
                <h1
                  className="
text-2xl

font-bold

mb-3

bg-gradient-to-r
from-pink-400
to-purple-400

bg-clip-text
text-transparent
"
                >
                  Your Following ({user?.following?.length || 0})
                </h1>

                <p className="text-slate-400 text-sm">
                  Click to view following list
                </p>

                <div className="mt-4 flex -space-x-3">
                  {user?.following?.slice(0, 5).map((f) => (
                    <Image
                      key={f?.following?.id}
                      src={f?.following?.profileImageUrl || ""}
                      alt="following-preview"
                      width={45}
                      height={45}
                      className="
rounded-full

border-2 border-black

object-cover
"
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
        {openNotificationsModal && (
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
w-[95%]
max-w-2xl

max-h-[85vh]

overflow-hidden

bg-[#0f0f0f]

border border-slate-800

rounded-3xl

shadow-2xl
"
            >
              {/* Header */}
              <div
                className="
flex items-center justify-between

p-5

border-b border-slate-800
"
              >
                <h1
                  className="
text-2xl

font-bold

bg-gradient-to-r
from-yellow-300
to-orange-400

bg-clip-text
text-transparent
"
                >
                  Notifications
                </h1>
                <button
                  onClick={() => {
                    const ids =
                      notifications
                        ?.map((notification: any) => String(notification?.id))
                        ?.filter(Boolean) || [];

                    setClearedNotifications((prev) => [
                      ...new Set([...prev, ...ids]),
                    ]);

                    toast.success("Notifications cleared");
                  }}
                  className="
px-4 py-2

rounded-xl

bg-red-500/10

border border-red-500/30

text-red-400

hover:bg-red-500/20

transition-all duration-300
"
                >
                  Clear All
                </button>
                <button
                  onClick={() => setOpenNotificationsModal(false)}
                  className="
text-slate-400

hover:text-white

text-xl
"
                >
                  ✕
                </button>
              </div>

              {/* Notifications */}
              <div
                className="
overflow-y-auto

max-h-[70vh]

p-5

space-y-4
"
              >
                {notifications
                  .filter(
                    (notification: any) =>
                      !clearedNotifications.includes(String(notification?.id)),
                  )
                  ?.map((notification: any) => (
                    <div
                      key={`${notification?.type}-${notification?.id}-${notification?.author?.id}`}
                      className="
bg-slate-900/70

border border-slate-800

rounded-2xl

p-4

hover:border-yellow-400/30

transition-all duration-300
"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <Link
                          href={`/user/${notification?.author?.id}`}
                          onClick={() => setOpenNotificationsModal(false)}
                          className="
text-yellow-300

font-semibold

hover:underline
"
                        >
                          {notification?.author?.firstName}{" "}
                          {notification?.author?.lastName}
                        </Link>

                        <div className="text-xs text-slate-500">
                          {notification?.createdAt &&
                          !isNaN(new Date(notification.createdAt).getTime())
                            ? new Date(notification.createdAt).toLocaleString(
                                "en-IN",
                                {
                                  day: "numeric",
                                  month: "short",
                                  hour: "numeric",
                                  minute: "2-digit",
                                },
                              )
                            : "just now"}
                        </div>
                      </div>

                      <p className="mt-3 text-slate-300 text-sm">
                        {notification?.type === "comment"
                          ? "commented on your tweet:"
                          : "started following you"}
                      </p>

                      {notification?.type === "comment" ? (
                        <div
                          className="
mt-2

bg-black/40

border border-slate-800

rounded-xl

p-3

text-sm text-slate-200
"
                        >
                          {notification?.content}
                        </div>
                      ) : (
                        <div
                          className="
mt-2

flex items-center gap-2

text-emerald-400

text-sm
"
                        >
                          ✨ New follower
                        </div>
                      )}
                    </div>
                  ))}

                {!tweets?.flatMap((tweet: any) =>
                  tweet?.author?.id === user?.id
                    ? tweet?.comments?.filter(
                        (c: any) => c?.author?.id === user?.id,
                      )
                    : [],
                )?.length && (
                  <div className="text-center text-slate-500 py-10">
                    No notifications yet
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {openMessagesModal && (
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
w-[95%]
max-w-2xl

max-h-[85vh]

overflow-hidden

bg-[#0f0f0f]

border border-slate-800

rounded-3xl

shadow-2xl
"
            >
              {/* Header */}
              <div
                className="
flex items-center justify-between

p-5

border-b border-slate-800
"
              >
                <h1
                  className="
text-2xl

font-bold

bg-gradient-to-r
from-sky-400
to-cyan-300

bg-clip-text
text-transparent
"
                >
                  Comments
                </h1>
                <button
                  onClick={() => {
                    const ids =
                      tweets?.flatMap((tweet: any) =>
                        tweet?.author?.id === user?.id
                          ? tweet?.comments
                              ?.filter((c: any) => c?.author?.id !== user?.id)
                              ?.map((c: any) => c?.id)
                          : [],
                      ) || [];

                    setClearedMessages((prev) => [
                      ...new Set([...prev, ...ids]),
                    ]);

                    toast.success("Comments cleared");
                  }}
                  className="
px-4 py-2

rounded-xl

bg-red-500/10

border border-red-500/30

text-red-400

hover:bg-red-500/20

transition-all duration-300
"
                >
                  Clear All
                </button>

                <button
                  onClick={() => setOpenMessagesModal(false)}
                  className="
text-slate-400

hover:text-white

text-xl
"
                >
                  ✕
                </button>
              </div>

              {/* Comments */}
              <div className="overflow-y-auto max-h-[70vh] p-5 space-y-4">
                {tweets
                  ?.flatMap((tweet: any) =>
                    tweet?.author?.id === user?.id
                      ? tweet?.comments
                          ?.filter((c: any) => c?.author?.id !== user?.id)
                          ?.map((c: any) => ({
                            ...c,
                            tweetAuthor: tweet?.author,
                          }))
                      : [],
                  )
                  ?.filter(
                    (comment: any) =>
                      !clearedMessages.includes(String(comment?.id)),
                  )
                  ?.map((comment: any) => (
                    <div
                      key={`${comment?.id}-${comment?.author?.id}`}
                      className="
bg-slate-900/70

border border-slate-800

rounded-2xl

p-4

hover:border-sky-500/30

transition-all duration-300
"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Link
                            href={`/user/${comment?.tweetAuthor?.id}`}
                            onClick={() => setOpenMessagesModal(false)}
                            className="
text-sky-400

font-semibold

hover:underline
"
                          >
                            {comment?.tweetAuthor?.firstName}{" "}
                            {comment?.tweetAuthor?.lastName}
                          </Link>

                          <div className="text-xs text-slate-500">
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
                              : "just now"}
                          </div>
                        </div>
                      </div>

                      <p className="mt-3 text-slate-300 text-sm leading-relaxed">
                        {comment?.content}
                      </p>
                    </div>
                  ))}

                {notifications?.filter(
                  (notification: any) =>
                    !clearedNotifications.includes(notification?.id),
                )?.length === 0 && (
                  <div className="text-center text-slate-500 py-10">
                    No comments yet
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {openFollowersModal && (
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
w-[95%]
max-w-md

max-h-[80vh]

overflow-hidden

bg-[#0f0f0f]

border border-slate-800

rounded-3xl

shadow-2xl
"
            >
              {/* Header */}
              <div
                className="
flex items-center justify-between

p-5

border-b border-slate-800
"
              >
                <h1
                  className="
text-2xl

font-bold

bg-gradient-to-r
from-sky-400
to-cyan-300

bg-clip-text
text-transparent
"
                >
                  Followers
                </h1>

                <button
                  onClick={() => setOpenFollowersModal(false)}
                  className="
text-slate-400

hover:text-white

text-xl
"
                >
                  ✕
                </button>
              </div>

              {/* Search */}
              <div className="p-4 border-b border-slate-800">
                <input
                  value={searchFollowers}
                  onChange={(e) => setSearchFollowers(e.target.value)}
                  placeholder="Search followers..."
                  className="
w-full

bg-black

border border-slate-700

rounded-xl

px-4 py-3

outline-none

focus:border-sky-500

text-white
"
                />
              </div>

              {/* Users */}
              <div
                className="
overflow-y-auto

max-h-[55vh]

p-4

space-y-4
"
              >
                {user?.followers
                  ?.filter((f) =>
                    `${f?.follower?.firstName} ${f?.follower?.lastName}`
                      .toLowerCase()
                      .includes(searchFollowers.toLowerCase()),
                  )
                  .map((f) => (
                    <div
                      key={f?.follower?.id}
                      onClick={() => {
                        router.push(`/user/${f?.follower?.id}`);

                        setOpenFollowersModal(false);
                      }}
                      className="
flex items-center gap-3

cursor-pointer

hover:bg-slate-900

p-3

rounded-2xl

transition-all duration-300
"
                    >
                      <Image
                        src={f?.follower?.profileImageUrl || ""}
                        alt="followers-user"
                        width={55}
                        height={55}
                        className="
rounded-full

object-cover

border border-slate-700
"
                      />

                      <div>
                        <h1 className="font-semibold text-white">
                          {f?.follower?.firstName} {f?.follower?.lastName}
                        </h1>

                        <p className="text-sm text-slate-400">Follower</p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {openFollowingModal && (
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
w-[95%]
max-w-md

max-h-[80vh]

overflow-hidden

bg-[#0f0f0f]

border border-slate-800

rounded-3xl

shadow-2xl
"
            >
              {/* Header */}
              <div
                className="
flex items-center justify-between

p-5

border-b border-slate-800
"
              >
                <h1
                  className="
text-2xl

font-bold

bg-gradient-to-r
from-pink-400
to-purple-400

bg-clip-text
text-transparent
"
                >
                  Following
                </h1>

                <button
                  onClick={() => setOpenFollowingModal(false)}
                  className="
text-slate-400

hover:text-white

text-xl
"
                >
                  ✕
                </button>
              </div>

              {/* Search */}
              <div className="p-4 border-b border-slate-800">
                <input
                  value={searchFollowing}
                  onChange={(e) => setSearchFollowing(e.target.value)}
                  placeholder="Search following..."
                  className="
w-full

bg-black

border border-slate-700

rounded-xl

px-4 py-3

outline-none

focus:border-pink-500

text-white
"
                />
              </div>

              {/* Users */}
              <div
                className="
overflow-y-auto

max-h-[55vh]

p-4

space-y-4
"
              >
                {user?.following
                  ?.filter((f) =>
                    `${f?.following?.firstName} ${f?.following?.lastName}`
                      .toLowerCase()
                      .includes(searchFollowing.toLowerCase()),
                  )
                  .map((f) => (
                    <div
                      key={f?.following?.id}
                      onClick={() => {
                        router.push(`/user/${f?.following?.id}`);

                        setOpenFollowingModal(false);
                      }}
                      className="
flex items-center gap-3

cursor-pointer

hover:bg-slate-900

p-3

rounded-2xl

transition-all duration-300
"
                    >
                      <Image
                        src={f?.following?.profileImageUrl || ""}
                        alt="following-user"
                        width={55}
                        height={55}
                        className="
rounded-full

object-cover

border border-slate-700
"
                      />

                      <div>
                        <h1 className="font-semibold text-white">
                          {f?.following?.firstName} {f?.following?.lastName}
                        </h1>

                        <p className="text-sm text-slate-400">Following</p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TwitterLayout;
