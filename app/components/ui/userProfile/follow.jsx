"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { SlUserFollow, SlUserFollowing } from "react-icons/sl";

export default function Follow() {
  const { data: session } = useSession();
  const [following, setFollowing] = useState([]);

  useEffect(() => {
    if (session) {
      fetchFollowing();
    }
  }, [session]);

  const fetchFollowing = async () => {
    try {
      const response = await fetch("/api/following");
      const data = await response.json();

      if (response.ok) {
        setFollowing(data.following);
      } else {
        console.error("Error fetching following list:", data.error);
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  const handleFollow = async (email) => {
    if (!session) {
      alert("You need to sign in first.");
      return;
    }

    const isFollowing = following.includes(email);
    const endpoint = isFollowing ? "/api/unfollow" : "/api/follow"; // Adjust API for unfollowing

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.user.token}`,
        },
        body: JSON.stringify({ authorEmail: email }),
      });

      if (response.ok) {
        setFollowing((prev) =>
          isFollowing
            ? prev.filter((e) => e !== email) // Remove if unfollowing
            : [...prev, email] // Add if following
        );
      } else {
        console.error("Error:", await response.json());
      }
    } catch (error) {
      console.error("Error following/unfollowing user:", error);
    }
  };

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-1">
        <div className="flex items-center justify-between mb-6 border-b border-gray-200 pb-4">
          <h2 className="text-2xl font-bold text-gray-800">Following</h2>
          <span className="bg-blue-500 text-white text-sm font-medium px-4 py-1 rounded-full">
            {following.length}
          </span>
        </div>

        {following.length > 0 ? (
          <div className="space-y-2">
            {following.map((email, index) => (
              <div
                key={index}
                className="flex items-center p-3 rounded-lg hover:bg-blue-50 transition-colors duration-200"
              >
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium mr-4">
                  {email.charAt(0).toUpperCase()}
                </div>
                <div className="text-gray-700 font-medium flex-1 overflow-hidden">
                  <div className="w-full">{email}</div>
                </div>
                <button
                  onClick={() => handleFollow(email)}
                  className={`ml-3 p-2 rounded-full transition ease-in-out duration-300 
                    ${following.includes(email) ? "bg-blue-500 hover:bg-blue-600 text-white" : "bg-white border-2 border-gray-300 hover:bg-gray-100"}`}
                >
                  {following.includes(email) ? <SlUserFollowing size={25} /> : <SlUserFollow size={25} />}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-lg font-medium text-gray-500">
              You're not following anyone yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
