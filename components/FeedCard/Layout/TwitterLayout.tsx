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
import { useQueryClient } from "@tanstack/react-query";
import { graphqlClient } from "@/clients/api";
import { verifyGoogleTokenQuery } from "@/graphql/query/user";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";

import toast from "react-hot-toast";
import { useCallback, useMemo } from "react";
import { FiCheckCircle } from "react-icons/fi";
import { FaShuttleSpace } from "react-icons/fa6";
import Image from "next/image";
import { FaTwitch } from "react-icons/fa";
import { SiSpacex } from "react-icons/si";
import Link from "next/link";
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
        link: "/",
      },
      {
        title: "Notifications",
        icon: <BsFillBellFill />,
        link: "/",
      },
      {
        title: "Messages",
        icon: <BsFillEnvelopeDashFill />,
        link: "/",
      },
      {
        title: "Bookmarks",
        icon: <BsBookmarkHeart />,
        link: "/",
      },
      {
        title: "Tweet Blue",
        icon: <BiMoney />,
        link: "/",
      },
      {
        title: "Profile",
        icon: <BiSolidUser />,
        link: `/${user?.id}`,
      },
      {
        title: "More Options",
        icon: <CgOptions />,
        link: "/",
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
grid grid-cols-12 min-w-0
h-screen w-full overflow-hidden

px-0 sm:px-2 md:px-4 lg:px-10 xl:px-20
"
      >
        <div
          className="
col-span-3 sm:col-span-2 md:col-span-3 lg:col-span-3

h-screen sticky top-0

pt-2 px-1 sm:px-2 md:px-4

flex flex-col items-center lg:items-start

min-w-[72px] sm:min-w-[90px] md:min-w-[220px]

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
                  <Link
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
                    href={item.link}
                  >
                    <span className="text-xl sm:text-2xl md:text-3xl">
                      {item.icon}
                    </span>
                    <span className="hidden xl:block whitespace-nowrap">
                      {item.title}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-5 px-3">
              <Link href="/">
                <button
                  className="
group relative overflow-hidden

w-12 h-12
sm:w-14 sm:h-14
md:w-full md:h-auto

rounded-full md:rounded-2xl

py-0 md:py-2
px-0 md:px-3

flex items-center justify-center

bg-gradient-to-r from-sky-500 via-blue-500 to-cyan-400

shadow-[0_8px_25px_rgba(29,155,240,0.35)]
hover:shadow-[0_12px_35px_rgba(29,155,240,0.55)]

transition-all duration-300

hover:scale-[1.04]

mx-auto
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

                  <div className="relative z-10 flex justify-center items-center gap-3">
                    <SiSpacex
                      className="
text-2xl
sm:text-3xl
md:text-5xl

text-amber-300

drop-shadow-[0_4px_12px_rgba(0,0,0,0.35)]

transition-all duration-500 ease-out

group-hover:-translate-y-1
group-hover:rotate-[-22deg]
group-hover:scale-110

animate-pulse
"
                    />
                  </div>

                  {/* Space Suit Icon */}
                </button>{" "}
              </Link>
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
hidden md:flex
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

col-span-9 sm:col-span-10 md:col-span-6 lg:col-span-6

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
hidden xl:block
xl:col-span-3

p-3 xl:p-5
"
        >
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
};

export default TwitterLayout;
