"use client";

import { useCurrentUser } from "@/hooks/user";
import Image from "next/image";
import { useRouter } from "next/navigation";

const RightSidebar = () => {
  const { user } = useCurrentUser();
  const router = useRouter();

  return (
    <div className="hidden lg:block w-[320px] p-4">
      <div
        className="
bg-black/70

border border-slate-800

rounded-2xl

p-4

sticky top-5

backdrop-blur-xl
"
      >
        <h1 className="text-2xl font-bold mb-5">Recommended Users</h1>

        <div className="space-y-4">
          {user?.recommendedUsers?.length ? (
            user.recommendedUsers.map((u) => (
              <div
                key={u?.id}
                onClick={() => router.push(`/user/${u?.id}`)}
                className="
flex items-center gap-3

cursor-pointer

hover:bg-slate-900

p-2

rounded-xl

transition-all duration-300
"
              >
                <Image
                  src={u?.profileImageUrl || ""}
                  alt="user"
                  width={50}
                  height={50}
                  className="
rounded-full

object-cover

border border-slate-700
"
                />

                <div>
                  <h1 className="font-semibold text-white">
                    {u?.firstName} {u?.lastName}
                  </h1>

                  <p className="text-sm text-slate-400">Suggested for you</p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-slate-500 text-sm">No recommendations yet</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RightSidebar;
