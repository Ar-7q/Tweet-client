"use client";

import { useState } from "react";
import { useGetAllTweets } from "@/hooks/tweet";
import { useCurrentUser } from "@/hooks/user";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { BiSearch } from "react-icons/bi";

const ExplorePage = () => {
  const router = useRouter();

  const { tweets = [] } = useGetAllTweets();

  const { user } = useCurrentUser();

  const [search, setSearch] = useState("");

  // hashtag extraction
  const hashtags = (tweets || []).flatMap(
    (tweet: any) => tweet.content?.match(/#\w+/g) || [],
  );

  // unique hashtags
  const uniqueHashtags = [...new Set(hashtags)];

  // search users
  const allUsers = (tweets || []).map((tweet: any) => tweet.author);

  const uniqueUsers = allUsers.filter(
    (user: any, index: number, self: any) =>
      index === self.findIndex((u: any) => u.id === user.id),
  );

  const searchedUsers = uniqueUsers.filter((u: any) =>
    `${u.firstName} ${u.lastName}`.toLowerCase().includes(search.toLowerCase()),
  );

  // search hashtags
  const searchedHashtags = uniqueHashtags.filter((tag: any) =>
    tag.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    
    <div className="min-h-screen bg-black text-white">
      {/* Search Bar */}
      <div className="sticky top-0 z-20 bg-black/80 backdrop-blur-xl border-b border-slate-800 p-4">
        <div className="flex items-center gap-3 bg-slate-900 rounded-full px-4 py-3">
          <BiSearch className="text-2xl text-slate-400" />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users or hashtags"
            className="
w-full
bg-transparent
outline-none
text-white
placeholder:text-slate-500
"
          />
        </div>
      </div>

      {/* Users */}
      {search && searchedUsers.length > 0 && (
        <div className="p-4">
          <h1 className="text-xl font-bold mb-4">Users</h1>

          <div className="space-y-3">
            {searchedUsers.map((u: any) => (
              <div
                key={u.id}
                onClick={() => router.push(`/user/${u.id}`)}
                className="
flex items-center gap-3
p-3
rounded-2xl
hover:bg-slate-900
cursor-pointer
transition-all
"
              >
                <Image
                  src={u.profileImageUrl || ""}
                  alt="user"
                  width={55}
                  height={55}
                  className="rounded-full object-cover"
                />

                <div>
                  <h1 className="font-semibold">
                    {u.firstName} {u.lastName}
                  </h1>

                  <p className="text-sm text-slate-400">
                    @{u.firstName.toLowerCase()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Trending Hashtags */}
      <div className="px-4 pb-10">
        <h1
          className="
text-3xl
font-bold
mb-6
bg-gradient-to-r
from-sky-400
to-cyan-300
bg-clip-text
text-transparent
"
        >
          Trending
        </h1>

        <div className="space-y-4">
          {searchedHashtags.map((tag: any, index: number) => {
            const hashtagTweets = (tweets || []).filter((tweet: any) =>
              tweet.content?.includes(tag),
            );

            const previewImage = hashtagTweets.find(
              (tweet: any) => tweet.imageURL,
            );

            return (
              <div
                key={index}
                onClick={() => router.push(`/explore/${tag.replace("#", "")}`)}
                className="
group

relative

overflow-hidden

rounded-3xl

bg-gradient-to-br
from-slate-900
to-black

border border-slate-800

hover:border-sky-500/40

cursor-pointer

transition-all duration-300

hover:scale-[1.01]
"
              >
                {/* background image */}
                {previewImage?.imageURL && (
                  <Image
                    src={previewImage.imageURL}
                    alt="hashtag-preview"
                    width={1000}
                    height={500}
                    className="
absolute inset-0
w-full h-full
object-cover
opacity-20
group-hover:opacity-30
transition-all
"
                  />
                )}

                <div className="relative z-10 p-6">
                  <h1
                    className="
text-2xl
font-bold
text-sky-400
"
                  >
                    {tag}
                  </h1>

                  <p className="text-slate-400 mt-2">
                    {hashtagTweets.length} posts
                  </p>

                  <div className="mt-4 flex -space-x-3">
                    {hashtagTweets.slice(0, 4).map((tweet: any) => (
                      <Image
                        key={tweet.id}
                        src={tweet.author?.profileImageUrl || ""}
                        alt="user"
                        width={40}
                        height={40}
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
            );
          })}
        </div>
      </div>

      {/* Explore Feed */}
    </div>
  );
};

export default ExplorePage;
