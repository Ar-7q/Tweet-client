"use client";

import { useParams, useRouter } from "next/navigation";
import { useGetAllTweets } from "@/hooks/tweet";
import Image from "next/image";
import { IoArrowBack } from "react-icons/io5";
import TwitterLayout from "@/components/FeedCard/Layout/TwitterLayout";

const HashtagPage = () => {
  const router = useRouter();

  const params = useParams();

  const { tweets = [] } = useGetAllTweets();

  const tag = `#${params.tag}`;

  const filteredTweets = (tweets || []).filter((tweet: any) =>
    tweet.content?.toLowerCase().includes(tag.toLowerCase()),
  );

  return (
    <TwitterLayout>
      <div className="min-h-screen bg-black text-white">
        {/* Header */}
        <div
          className="
sticky top-0 z-20

bg-black/80
backdrop-blur-xl

border-b border-slate-800

p-4

flex items-center gap-4
"
        >
          <button
            onClick={() => router.back()}
            className="
text-2xl
hover:text-sky-400
transition-all
"
          >
            <IoArrowBack />
          </button>

          <div>
            <h1 className="text-2xl font-bold text-sky-400">{tag}</h1>

            <p className="text-sm text-slate-500">
              {filteredTweets.length} posts
            </p>
          </div>
        </div>

        {/* Tweets */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 p-2">
          {filteredTweets.map((tweet: any) => (
            <div
              key={tweet.id}
              onClick={() => router.push(`/user/${tweet.author?.id}`)}
              className="
group

relative

aspect-square

overflow-hidden

rounded-2xl

cursor-pointer
"
            >
              {tweet.imageURL ? (
                <Image
                  src={tweet.imageURL}
                  alt="tweet-image"
                  width={500}
                  height={500}
                  className="
w-full h-full
object-cover

group-hover:scale-110

transition-all duration-500
"
                />
              ) : (
                <div
                  className="
w-full h-full

bg-slate-900

flex items-center justify-center

p-4

text-sm text-slate-300
"
                >
                  {tweet.content}
                </div>
              )}

              <div
                className="
absolute inset-0

bg-black/50

opacity-0
group-hover:opacity-100

transition-all

flex items-end
"
              >
                <div className="p-4">
                  <h1 className="font-semibold">
                    {tweet.author?.firstName} {tweet.author?.lastName}
                  </h1>

                  <p className="text-sm text-slate-300 line-clamp-2">
                    {tweet.content}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </TwitterLayout>
  );
};

export default HashtagPage;
