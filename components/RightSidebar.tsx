"use client";

import { useCurrentUser } from "@/hooks/user";
import Image from "next/image";
import { useRouter } from "next/navigation";

const RightSidebar = () => {
  const { user } = useCurrentUser();

  const router = useRouter();

  return (
    <div
      className="
hidden lg:flex

flex-col

w-full
max-w-[340px]
xl:max-w-[380px]

px-2
xl:px-4

py-4
"
    >
      <div
        className="
sticky top-4

max-h-[95vh]
overflow-y-auto

rounded-3xl

border border-slate-800/80

bg-black/60

backdrop-blur-2xl

shadow-[0_0_30px_rgba(15,23,42,0.6)]

p-4
xl:p-5

transition-all duration-500
"
      >
        {/* Header */}
        <div className="mb-5">
          <h1
            className="
text-xl
xl:text-2xl

font-bold

bg-gradient-to-r
from-sky-400
via-cyan-300
to-blue-500

bg-clip-text
text-transparent
"
          >
            Recommended Users
          </h1>

          <p className="text-slate-500 text-sm mt-1">
            Connect with people you may know
          </p>
        </div>

        {/* Users */}
        <div className="space-y-3">
          {user?.recommendedUsers?.length ? (
            user.recommendedUsers.map((u) => (
              <div
                key={u?.id}
                onClick={() => router.push(`/user/${u?.id}`)}
                className="
group

flex items-center gap-3

cursor-pointer

rounded-2xl

border border-transparent

bg-slate-900/40

hover:bg-slate-900/80
hover:border-sky-500/20

p-3

transition-all duration-300

hover:scale-[1.02]
"
              >
                {/* Avatar */}
                <div className="relative shrink-0">
                  <div
                    className="
absolute inset-0

rounded-full

bg-sky-500/20

blur-md

opacity-0
group-hover:opacity-100

transition-all duration-300
"
                  />

                  <Image
                    src={u?.profileImageUrl || "/default-avatar.png"}
                    alt="user"
                    width={52}
                    height={52}
                    className="
relative

rounded-full

object-cover

border border-slate-700

group-hover:scale-105

transition-all duration-300
"
                  />
                </div>

                {/* Info */}
                <div className="min-w-0 flex-1">
                  <h1
                    className="
font-semibold

text-white

truncate

text-sm
xl:text-base
"
                  >
                    {u?.firstName} {u?.lastName}
                  </h1>

                  <p
                    className="
text-xs
xl:text-sm

text-slate-400

truncate
"
                  >
                    Suggested for you
                  </p>
                </div>

                {/* Follow Hint */}
                <div
                  className="
hidden xl:flex

items-center justify-center

px-3 py-1.5

rounded-full

bg-sky-500/10

text-sky-400

text-xs

font-medium

border border-sky-500/20
"
                >
                  View
                </div>
              </div>
            ))
          ) : (
            <div
              className="
text-slate-500

text-sm

text-center

py-10
"
            >
              No recommendations yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RightSidebar;
