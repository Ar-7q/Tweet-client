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
    const {data}=props
    const [text, setText] = useState("");

    useEffect(() => {
        setText(generate({ exactly: 40, join: " " }));
    }, []);

    return (
        <div>
            <div className="border border-r-0 border-l-0 border-b-0 border-gray-600 p-3 sm:p-4 md:p-5 hover:bg-slate-900 transition-all cursor-pointer">
                <div className="grid grid-cols-12 gap-2 md:gap-3">
                    <div className="col-span-2 sm:col-span-1">
                       {data?.author?.profileImageUrl && <Image
                            src={data?.author.profileImageUrl}
                            alt="user-image"
                            className="rounded-full"
                            height={50}
                            width={50}
                        />}
                    </div>

                    <div className="col-span-10 sm:col-span-11">
                        <h5 className="font-semibold text-sm sm:text-base">
                           {data?.author?.firstName} {data?.author?.lastName}
                        </h5>

                        <p className="text-xs sm:text-sm md:text-base break-words">
                            {data?.content}
                        </p>

                        <div className="flex justify-between mt-4 text-base sm:text-lg md:text-xl items-center p-1 sm:p-2 w-full sm:w-[90%]">
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