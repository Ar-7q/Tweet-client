"use client";

import React from "react";
import { SiSpacex } from "react-icons/si";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { graphqlClient } from "@/clients/api";
import { logoutUserMutation } from "@/graphql/mutation/user";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const LogoutButton = () => {
  const router = useRouter();

  const queryClient = useQueryClient();

  const { mutate: logout } = useMutation({
    mutationFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 1800));

      return graphqlClient.request(logoutUserMutation);
    },

    onMutate: () => {
      toast.loading("Logging out...", {
        id: "logout",
      });
    },

    onSuccess: async () => {
      localStorage.removeItem("_tweet_token");

      await queryClient.invalidateQueries({
        queryKey: ["current-user"],
      });

      queryClient.clear();

      toast.success("Logged out successfully", {
        id: "logout",
      });

      router.push("/");

      window.location.reload();
    },

    onError: () => {
      toast.error("Failed to logout", {
        id: "logout",
      });
    },
  });

  return (
    <button
      onClick={() => logout()}
      className="
group relative overflow-hidden

w-12 h-12
sm:w-14 sm:h-14
md:w-full md:h-[72px]

rounded-full md:rounded-2xl

py-0 md:py-2
px-0 md:px-3

flex items-center justify-center

bg-gradient-to-r from-red-500 via-pink-500 to-orange-400

shadow-[0_8px_25px_rgba(239,68,68,0.35)]
hover:shadow-[0_12px_35px_rgba(239,68,68,0.55)]

transition-all duration-500

hover:scale-[1.04]

mx-auto
"
    >
      {/* Shine */}
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

      {/* SpaceX Icon */}
      <div
        className="
absolute

flex items-center justify-center

transition-all duration-500 ease-out

group-hover:opacity-0
group-hover:scale-0
"
      >
        <SiSpacex
          className="
text-2xl
sm:text-3xl
md:text-5xl

text-yellow-300

drop-shadow-[0_4px_12px_rgba(0,0,0,0.35)]

transition-all duration-500 ease-out

group-hover:-translate-y-1
group-hover:rotate-[-22deg]

animate-pulse
"
        />
      </div>

      {/* Logout Text */}
      <div
        className="
absolute

opacity-0
scale-75

group-hover:opacity-100
group-hover:scale-100

transition-all duration-500 ease-out

z-10
"
      >
        <span
          className="
text-white

font-bold

tracking-[0.25em]

uppercase

text-xs
sm:text-sm
md:text-lg

drop-shadow-lg
"
        >
          Logout
        </span>
      </div>
    </button>
  );
};

export default LogoutButton;
