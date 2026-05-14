"use client";
import FeedCard from "@/components/FeedCard/page";

import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { log } from "console";
import Image from "next/image";
import React, { useCallback } from "react";
import { BiHash, BiHomeCircle, BiMoney, BiSolidUser, BiUserCheck, BiUserCircle, BiUserX } from "react-icons/bi";
import { BsBellSlash, BsBookmarkCheckFill, BsBookmarkHeart, BsEnvelopeArrowUpFill, BsEnvelopeAt, BsEnvelopeDash, BsFillBellFill, BsFillEnvelopeDashFill } from "react-icons/bs";
import { CgOptions } from "react-icons/cg";
import { FaTwitter } from "react-icons/fa";
import { FiAperture, FiCheckCircle } from "react-icons/fi";
import { GiSpaceShuttle, GiSpaceSuit } from "react-icons/gi";
import { RiSpaceShipLine } from "react-icons/ri";
import { SiSpaceship } from "react-icons/si";

interface TwitterSidebarButton {
  title: string
  icon: React.ReactNode
}
const sidebarMenuItems: TwitterSidebarButton[] = [
  {
    title: 'Home',
    icon: <BiHomeCircle />
  }, {
    title: 'Explore',
    icon: <BiHash />
  }, {
    title: 'Notifications',
    icon: <BsFillBellFill />
  }, {
    title: 'Messages',
    icon: <BsFillEnvelopeDashFill />
  }, {
    title: 'Bookmarks',
    icon: <BsBookmarkHeart />
  }, {
    title: 'Tweet Blue',
    icon: <BiMoney />
  }, {
    title: 'Profile',
    icon: <BiSolidUser />
  }, {
    title: "More Options",
    icon: <CgOptions />
  }
]

export default function Home() {

  const handleLoginwithGoogle = useCallback((cred: CredentialResponse) => { }, [])

  return (
    <div>

      <div className="grid grid-cols-12 min-h-screen w-full
px-4 sm:px-6 md:px-8 lg:px-16 xl:px-32">

        <div className="col-span-2 md:col-span-3 pt-1
pl-2 sm:pl-4
flex flex-col items-center lg:items-start
min-w-[70px] sm:min-w-[80px] md:min-w-[220px]
md:ml-2 lg:ml-10 xl:ml-20">
          {/* twitter image from react icons */}
          <div className="text-2xl h-fit w-fit hover:bg-gray-800 rounded-full p-4 cursor-pointer transition-all">
            <FaTwitter />
          </div>
          <div className="mt-2 text-sm sm:text-base md:text-lg xl:text-xl pr-2 md:pr-4">
            <ul>
              {sidebarMenuItems.map((item) => (
                <li className="flex justify-center lg:justify-start 
items-center gap-2 md:gap-4
hover:bg-gray-600 rounded-full
px-2 md:px-3 py-2 md:py-3
cursor-pointer w-fit mt-2 transition-all"
                  key={item.title}>
                  <span className="text-xl sm:text-2xl md:text-3xl">{item.icon}</span>
                  <span className="hidden lg:block">
                    {item.title}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-5 px-3">
              <button className="group bg-[#1d9bf0] py-2 px-4 rounded-full w-full flex justify-center items-center overflow-hidden relative">

                <span className="flex items-center gap-3 z-10">

                  <FiCheckCircle className="text-white text-2xl" />

                  <GiSpaceSuit
                    className="text-gray-900 text-4xl drop-shadow-lg transition-transform duration-500 group-hover:-translate-y-1 group-hover:translate-x-2 group-hover:rotate-12 animate-pulse"
                  />

                </span>

                <span className="absolute inset-0 bg-white/30 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 skew-x-12"></span>

              </button>
            </div>
          </div>

        </div>
        <div className="feed-container
col-span-10 md:col-span-6 lg:col-span-5
w-full
border-l border-r border-gray-700">
          <FeedCard />
          <FeedCard />
          <FeedCard />
          <FeedCard />
          <FeedCard />
          <FeedCard />
        </div>

        <div className="hidden lg:block lg:col-span-3 p-5">
          <div className="p-5 bg-slate-700 rounded-lg">
            <h1 className="my-2 text-2xl">
              New User 🧰
            </h1>



            <GoogleLogin onSuccess={(cred) => console.log(cred)
            } />
          </div>
        </div>
      </div>
    </div >
  );
}
