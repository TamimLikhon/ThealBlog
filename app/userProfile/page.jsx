"use client";
import { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import UserProMyBlogSec from "../components/ui/userProfile/userProMyBlogSec";
import ChangeProfilePic from "../components/ui/userProfile/changeprofilepic";
import ChngProInfo from "../components/ui/userProfile/changeuserdetailts";
import Follow from "../components/ui/userProfile/follow";
import FetchVisitor from "../components/visitor/fetchvisitorstats";

export default function Profile() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!session) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const urls = [
          `/api/myposts?email=${session.user.email}`,
          "/api/following",
          "/api/auth/user",
          "/api/auth/image",
          `/api/auth/image?email=${session.user.email}`,
        ];

        const responses = await Promise.all(urls.map(url => fetch(url)));
        const jsonData = await Promise.all(responses.map(res => res.json()));

        setData({
          myPosts: jsonData[0],
          following: jsonData[1],
          user: jsonData[2],
          profileImage: jsonData[3],
          userImageByEmail: jsonData[4],
        });

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [session]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white text-white">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-48"></div>

      {!session ? (
        <div className="flex flex-col justify-center items-center text-center p-10 bg-white rounded-lg shadow-xl max-w-md mx-auto -mt-24">
                   <p className="text-black mb-6">Please sign in to view your profile.</p>
          <button
            onClick={() => signIn()}
            className="bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded-md font-semibold text-white transition duration-200 w-full flex justify-center items-center"
          >
            Sign In
          </button>
        </div>
      ) : (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 -mt-24 pb-12">
          <div className="max-w-5xl mx-auto">
            <div className="bg-white rounded-lg shadow-xl overflow-hidden mb-8">
              <div className="p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row items-center sm:items-start">
                  <div className="flex-shrink-0 rounded-full p-3 mb-4 sm:mb-0">
                    <ChangeProfilePic profileImage={data?.profileImage} />
                  </div>
                  <div className="sm:ml-6 text-center sm:text-left flex-1">
                    <ChngProInfo user={data?.user} />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="bg-white rounded-lg shadow-lg overflow-hidden lg:col-span-1">
                <Follow following={data?.following} />
              </div>

              <div className="overflow-hidden lg:col-span-2">
                <UserProMyBlogSec posts={data?.myPosts} />
              </div>
              <div className="overflow-hidden lg:col-span-2">
              <FetchVisitor />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
