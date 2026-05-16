// import Twitterlayout from "@/components/FeedCard/Layout/TwiiterLayout";
"use client";
import TwitterLayout from "@/components/FeedCard/Layout/TwitterLayout";
import FeedCard from "@/components/FeedCard/page";
import { useCurrentUser } from "@/hooks/user";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { BsArrowLeftCircleFill } from "react-icons/bs";

const UserProfilePage = () => {
  const { user } = useCurrentUser();
  const router = useRouter();
  const params = useParams();

  console.log(params.id);
  console.log(router);

  return (
    <div>
      <TwitterLayout>
        <div>
          <nav className="flex items-center gap-3 py-3 px-3">
            <BsArrowLeftCircleFill className="text-4xl" />
            <div>
              <h1 className="text-2xl font-semibold font-sans">Profile Page</h1>
              <h1 className="text-md font-bold text-slate-500 ">!00 Tweets</h1>
            </div>
          </nav>
          <div className="p-4 border-b border-amber-950">
            {user?.profileImageUrl && (
              <Image
                src={user?.profileImageUrl}
                alt="user-image"
                className="rounded-full"
                width={100}
                height={100}
              />
            )}
            <h1 className="text-2xl font-bold mt-5">Profile</h1>
          </div>
          <div>
            {user?.tweets?.map((tweet) => (
              <FeedCard data={tweet} key={tweet?.id} />
            ))}
          </div>
        </div>
      </TwitterLayout>
    </div>
  );
};

export default UserProfilePage;
