"use client";
import { graphqlClient } from "@/clients/api";
import FeedCard from "@/components/FeedCard/page";
import { verifyGoogleTokenQuery } from "@/graphql/query/user";
import { useCreateTweet, useGetAllTweets } from "@/hooks/tweet";
import { useCurrentUser } from "@/hooks/user";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { useQueryClient } from "@tanstack/react-query";
import { log } from "console";
import Image from "next/image";
import React, { useCallback, useState } from "react";
import toast from "react-hot-toast";
import {
  BiHash,
  BiHomeCircle,
  BiImageAdd,
  BiMoney,
  BiSolidUser,
  BiUserCheck,
  BiUserCircle,
  BiUserX,
} from "react-icons/bi";
import {
  BsBellSlash,
  BsBookmarkCheckFill,
  BsBookmarkHeart,
  BsEnvelopeArrowUpFill,
  BsEnvelopeAt,
  BsEnvelopeDash,
  BsFillBellFill,
  BsFillEnvelopeDashFill,
} from "react-icons/bs";
import { CgOptions } from "react-icons/cg";
import { FaSpaceShuttle, FaTwitter } from "react-icons/fa";
import { FiAperture, FiCheckCircle } from "react-icons/fi";
import { GiSpaceShuttle, GiSpaceSuit } from "react-icons/gi";
import { RiSpaceShipLine } from "react-icons/ri";
import { SiSpaceship } from "react-icons/si";

interface TwitterSidebarButton {
  title: string;
  icon: React.ReactNode;
}
const sidebarMenuItems: TwitterSidebarButton[] = [
  {
    title: "Home",
    icon: <BiHomeCircle />,
  },
  {
    title: "Explore",
    icon: <BiHash />,
  },
  {
    title: "Notifications",
    icon: <BsFillBellFill />,
  },
  {
    title: "Messages",
    icon: <BsFillEnvelopeDashFill />,
  },
  {
    title: "Bookmarks",
    icon: <BsBookmarkHeart />,
  },
  {
    title: "Tweet Blue",
    icon: <BiMoney />,
  },
  {
    title: "Profile",
    icon: <BiSolidUser />,
  },
  {
    title: "More Options",
    icon: <CgOptions />,
  },
];

export default function Home() {
  const { user } = useCurrentUser();
  const { tweets = [] } = useGetAllTweets();
  const { mutate } = useCreateTweet();

  const queryClient = useQueryClient();
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
        className="grid grid-cols-12 h-screen overflow-hidden w-full
px-2 sm:px-4 md:px-8 lg:px-16 xl:px-32"
      >
        <div
          className="col-span-2 md:col-span-3
h-screen sticky top-0
pt-1 pl-2 sm:pl-4
flex flex-col items-center lg:items-start
min-w-[70px] sm:min-w-[80px] md:min-w-[220px]
md:ml-2 lg:ml-10 xl:ml-20
relative overflow-hidden"
        >
          {/* twitter image from react icons */}
          <div className="text-2xl h-fit w-fit hover:bg-gray-800 rounded-full p-4 cursor-pointer transition-all">
            <FaTwitter />
          </div>
          <div className="mt-2 text-sm sm:text-base md:text-lg xl:text-xl pr-2 md:pr-4">
            <ul>
              {sidebarMenuItems.map((item) => (
                <li
                  className="flex justify-center lg:justify-start 
items-center gap-2 md:gap-4
hover:bg-gray-600 rounded-full
px-2 md:px-3 py-2 md:py-3
cursor-pointer w-fit mt-2 transition-all"
                  key={item.title}
                >
                  <span className="text-xl sm:text-2xl md:text-3xl">
                    {item.icon}
                  </span>
                  <span className="hidden lg:block">{item.title}</span>
                </li>
              ))}
            </ul>
            <div className="mt-5 px-3">
              <button
                className="
      group relative overflow-hidden

      w-full rounded-2xl
      py-3 px-5

      flex items-center justify-between

      bg-gradient-to-r from-sky-500 via-blue-500 to-cyan-400

      shadow-[0_8px_25px_rgba(29,155,240,0.35)]
      hover:shadow-[0_12px_35px_rgba(29,155,240,0.55)]

      transition-all duration-300
      hover:scale-[1.02]
    "
              >
                {/* Shine Effect */}
                <span
                  className="
        absolute inset-0
        translate-x-[-120%]
        group-hover:translate-x-[120%]

        bg-white/20
        skew-x-12

        transition-transform duration-1000
      "
                />

                {/* Left Content */}
                <span className="relative z-10 flex items-center gap-3">
                  <FiCheckCircle className="text-white text-2xl" />
                </span>

                {/* Space Suit Icon */}
                <div className="relative z-10">
                  <FaSpaceShuttle
                    className="
          text-gray-900
          text-5xl

          drop-shadow-[0_4px_12px_rgba(0,0,0,0.35)]

          transition-all duration-500 ease-out

          rotate-[0deg]
          translate-x-2
          group-hover:-translate-y-1
          group-hover:rotate-[-22deg]
          group-hover:scale-110

          animate-pulse
        "
                  />
                </div>
              </button>
            </div>
          </div>
          {user && (
            <div
              className="
      absolute bottom-4 left-1/2 -translate-x-1/2
      lg:left-0 lg:translate-x-0 lg:bottom-5

      group flex items-center gap-3

      px-3 sm:px-4 py-2.5
      w-fit max-w-[92%]

      rounded-2xl
      border border-white/10
      bg-white/10 backdrop-blur-xl

      shadow-[0_8px_30px_rgb(0,0,0,0.25)]
      hover:shadow-[0_12px_40px_rgb(59,130,246,0.25)]

      transition-all duration-300 ease-out
      hover:scale-[1.03]
      hover:bg-white/15

      animate-[fadeInUp_0.6s_ease]
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
              <div className="hidden sm:flex flex-col overflow-hidden">
                <h3
                  className="
          text-sm sm:text-base md:text-lg
          font-semibold tracking-wide
          text-white truncate

          max-w-[130px]
          md:max-w-[190px]
        "
                >
                  {user.firstName} {user.lastName}
                </h3>

                <p
                  className="
          text-xs md:text-sm
          text-slate-300
          truncate

          max-w-[140px]
          md:max-w-[200px]
        "
                >
                  @{user.firstName?.toLowerCase()}
                </p>
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
          className="feed-container
col-span-10 md:col-span-6 lg:col-span-5
h-screen overflow-y-auto
scrollbar-thin scrollbar-thumb-gray-700
scrollbar-track-transparent
hover:scrollbar-thumb-gray-600
scroll-smooth
w-full
border-l border-r border-gray-700"
        >
          <div>
            <div className="border border-r-0 border-l-0 bordeer-b-0 border-gray-600 p-5 hover:bg-slate-900 transition-all cursor-pointer">
              <div className="grid grid-cols-12 gap-2 md:gap-3">
                <div className="col-span-2 sm:col-span-1">
                  {user?.profileImageUrl && (
                    <Image
                      src={user?.profileImageUrl}
                      alt="user-image"
                      className="rounded-full"
                      height={50}
                      width={50}
                    />
                  )}
                </div>
                <div className="col-span-11">
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className=" w-full bg-transparent text-xl px-3 border-b border-slate-600"
                    placeholder="What's the Mood?"
                    rows={4}
                  ></textarea>

                  <div className="mt-2 flex justify-between items-center">
                    <BiImageAdd
                      onClick={handleSelectImage}
                      className="text-xl"
                    />
                    <button
                      onClick={handleCreateTweet}
                      className="bg-blue-300 text-black font-extrabold text-sm py-2 px-4 rounded-full cursor-pointer"
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
        </div>

        <div className="hidden lg:block lg:col-span-3 p-5">
          {!user && (
            <div className="p-5 bg-slate-700 rounded-lg">
              <h1 className="my-2 text-2xl">New User 🧰</h1>

              <GoogleLogin onSuccess={handleLoginwithGoogle} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
