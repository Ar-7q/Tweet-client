"use client";

import { graphqlClient } from "@/clients/api";
import TwitterLayout from "@/components/FeedCard/Layout/TwitterLayout";
import FeedCard from "@/components/FeedCard/page";
// import { uploadImageMutation } from "@/graphql/mutation/tweet";

import { useCreateTweet, useGetAllTweets } from "@/hooks/tweet";
import { useCurrentUser } from "@/hooks/user";
import {
  getCooldownRemaining,
  isCooldownActive,
  startCooldown,
} from "@/utils/cooldown";
import imageCompression from "browser-image-compression";

import Image from "next/image";

import React, { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { BiImageAdd } from "react-icons/bi";

export default function Home() {
  const { user } = useCurrentUser();
  const { tweets = [], isLoading } = useGetAllTweets();
  const { mutate } = useCreateTweet();

  // console.log(user);

  const [content, setContent] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const [previewImage, setPreviewImage] = useState("");
  const [showImageModal, setShowImageModal] = useState(false);
  const [tweetCooldown, setTweetCooldown] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setTweetCooldown(getCooldownRemaining(`tweet:${user?.id}`));
    }, 1000);

    return () => clearInterval(interval);
  }, [user]);

  const handleSelectImage = useCallback(() => {
    const input = document.createElement("input");

    input.setAttribute("type", "file");

    input.setAttribute("accept", "image/*");

    input.onchange = (event: any) => {
      const file = event.target.files?.[0];

      if (file) {
        const maxSizeInMB = 5;

        const fileSizeInMB = file.size / (1024 * 1024);

        if (fileSizeInMB > maxSizeInMB) {
          toast.error("Image size should be less than 5 MB");

          return;
        }

        setSelectedImage(file);

        const imageUrl = URL.createObjectURL(file);

        setPreviewImage(imageUrl);
        toast.success("Image picked successfully 🖼️");
      }
    };

    input.click();
  }, []);

  // const convertImageToBase64 = (file: File) => {
  //   return new Promise<string>((resolve, reject) => {
  //     const fileReader = new FileReader();

  //     fileReader.readAsDataURL(file);

  //     fileReader.onload = () => {
  //       resolve(fileReader.result as string);
  //     };

  //     fileReader.onerror = reject;
  //   });
  // };

  const handleCreateTweet = useCallback(async () => {
    if (!user) {
      toast.error("Tweet not posted. User is not signed in ❌");

      return;
    }

    if (!content.trim() && !selectedImage) {
      toast.error("Please write something or select an image");

      return;
    }

    const toastId = toast.loading("Uploading your tweet...");

    if (isCooldownActive(`tweet:${user?.id}`)) {
      toast.error(
        `Wait ${getCooldownRemaining(
          `tweet:${user?.id}`,
        )}s before tweeting again`,
      );

      return;
    }

    startCooldown(`tweet:${user?.id}`, 60);
    setIsUploading(true);

    try {
      let imageURL = "";
      let imagePublicId = "";

      // if (selectedImage) {
      //   const compressedImage = await imageCompression(selectedImage, {
      //     maxSizeMB: 0.05,

      //     maxWidthOrHeight: 600,

      //     useWebWorker: true,

      //     initialQuality: 0.5,
      //   });

      //   const base64 = await convertImageToBase64(compressedImage);

      //   const { uploadImage } = await graphqlClient.request(
      //     uploadImageMutation,
      //     {
      //       image: base64,
      //     },
      //   );

      //   imageURL = uploadImage?.imageURL ?? "";
      //   imagePublicId = uploadImage?.imagePublicId ?? "";
      // }
      if (selectedImage) {
  const compressedImage = await imageCompression(selectedImage, {
  maxSizeMB: 0.025,

  maxWidthOrHeight: 700,

  useWebWorker: true,

  initialQuality: 0.7,
});

  const formData = new FormData();

  formData.append("file", compressedImage);

  formData.append(
    "upload_preset",
    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!,
  );

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
    {
      method: "POST",
      body: formData,
    },
  );

  if (!response.ok) {
    throw new Error("Cloudinary upload failed");
  }

  const data = await response.json();

  imageURL = data.secure_url;
  imagePublicId = data.public_id;
}

      await mutate({
        content,
        imageURL,
        imagePublicId,
      });

      toast.success("Tweet uploaded successfully 🚀", {
        id: toastId,
      });

      setContent("");

      setSelectedImage(null);
      setPreviewImage("");
      setIsUploading(false);
    } catch (error) {
      console.log(error);
      setIsUploading(false);
      toast.error("Failed to upload tweet ❌", {
        id: toastId,
      });
    }
  }, [content, mutate, selectedImage, user]);
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
hover:shadow-[0_0_25px_rgba(56,189,248,0.15)]

hover:scale-[1.005]

backdrop-blur-md

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

focus:border-sky-400

focus:shadow-[0_0_15px_rgba(56,189,248,0.2)]

transition-all duration-300
border-b border-slate-700

outline-none

resize-none

placeholder:text-slate-500

overflow-hidden
"
                  placeholder="What's the Mood?"
                  rows={4}
                ></textarea>

                {previewImage && (
                  <div className="mt-4 relative">
                    <Image
                      src={previewImage}
                      alt="preview-image"
                      width={400}
                      height={400}
                      onClick={() => setShowImageModal(true)}
                      className="rounded-2xl max-h-[400px] w-full object-cover border border-slate-700 cursor-pointer hover:scale-[1.02] hover:brightness-110 transition-all duration-300"
                    />

                    <button
                      onClick={() => {
                        setSelectedImage(null);
                        setPreviewImage("");

                        toast.success("Image removed successfully 🗑️");
                      }}
                      className="
        absolute top-2 right-2

        bg-black/70

        text-white

        rounded-full

        px-2 py-1

        text-xs

        hover:bg-red-500

        transition-all
      "
                    >
                      ✕
                    </button>
                  </div>
                )}

                {showImageModal && (
                  <div
                    onClick={() => setShowImageModal(false)}
                    className="
fixed inset-0

bg-black/80
backdrop-blur-sm

z-50

flex items-center justify-center

animate-fadeIn
"
                  >
                    <div
                      className="
relative

max-w-4xl
w-[90%]

animate-scaleIn
"
                    >
                      <Image
                        src={previewImage}
                        alt="full-preview"
                        width={1000}
                        height={1000}
                        className="
rounded-3xl

max-h-[90vh]
w-full

object-contain
"
                      />

                      <button
                        onClick={() => setShowImageModal(false)}
                        className="
absolute top-3 right-3

bg-red-500

text-white

w-10 h-10

rounded-full

text-lg

hover:scale-110

transition-all duration-300
"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                )}

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

animate-bounce

hover:rotate-12

transition-all duration-300
"
                  />
                  <button
                    disabled={tweetCooldown > 0 || isUploading}
                    onClick={() => {
                      if (tweetCooldown > 0 || isUploading) {
                        return;
                      }

                      handleCreateTweet();
                    }}
                    className="
group relative overflow-hidden
disabled:opacity-50
disabled:cursor-not-allowed
bg-gradient-to-r
from-sky-500
via-cyan-400
to-blue-500

text-white

font-bold

rounded-full

cursor-pointer

transition-all duration-500

hover:scale-105
hover:shadow-[0_0_30px_rgba(56,189,248,0.55)]

active:scale-95

w-[54px]
hover:w-[150px]

h-[54px]

flex items-center justify-center

whitespace-nowrap
"
                  >
                    {/* Glow */}
                    <span
                      className="
absolute inset-0

bg-white/10

opacity-0
group-hover:opacity-100

transition-all duration-500
"
                    />

                    {/* Icon */}
                    <div
                      className="
absolute

flex items-center justify-center

transition-all duration-500

group-hover:opacity-0
group-hover:scale-0
"
                    >
                      <span
                        className="
text-2xl

animate-pulse

drop-shadow-lg
"
                      >
                        ⚡
                      </span>
                    </div>

                    {/* Hover Text */}
                    <div
                      className="
absolute

opacity-0
scale-75

group-hover:opacity-100
group-hover:scale-100

transition-all duration-500 ease-out
"
                    >
                      <span
                        className="
tracking-[0.3em]

uppercase

font-extrabold

text-sm
"
                      >
                        {isUploading
                          ? "Uploading..."
                          : tweetCooldown > 0
                            ? `${tweetCooldown}s`
                            : "Bang"}
                      </span>
                    </div>
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
