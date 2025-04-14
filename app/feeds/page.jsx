"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";

export default function Feeds() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("/api/fetchpost");
        const data = await response.json();
        setPosts(data); // Show only the first post
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 text-black">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 h-40 flex items-center justify-center">
        <h1 className="text-3xl font-bold text-white">Latest Insights</h1>
      </div>

      <div className="flex justify-center px-6 py-8">
        <div className="w-full max-w-4xl">
          {/* {!session ? (
            <div className="flex flex-col justify-center items-center text-center p-8 bg-white rounded-lg shadow-md max-w-md mx-auto -mt-20">
              <p className="text-gray-800 text-lg mb-6">Please sign in to view the latest feed.</p>
              <button
                onClick={() => signIn()}
                className="bg-blue-600 hover:bg-blue-700 px-6 py-2.5 rounded-lg font-medium text-white transition duration-200 w-full"
              >
                Sign In
              </button>
            </div>
          ) : (
            <> */}
              {posts.length === 0 ? (
                <div className="text-center py-20 px-6 bg-white rounded-lg shadow-md w-full max-w-3xl mx-auto">
                  <h2 className="text-2xl font-semibold mb-3 text-gray-800">
                    No Content Available
                  </h2>
                  <p className="text-gray-600 text-lg">
                    Check back soon for exclusive insights.
                  </p>
                </div>
              ) : (
                <div className="w-full mx-auto">
                  {posts.map((post) => (
                    <div
                      key={post._id}
                      className="p-8 mb-5 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                    >
                      <h2 className="text-3xl font-bold mb-4 text-gray-900 hover:text-blue-700 transition-colors">
                        <Link
                          href={`/feeds/${encodeURIComponent(post.title)}`}
                          className="hover:underline"
                        >
                          {post.title}
                        </Link>
                      </h2>
                      <p className="text-gray-600 mb-6 leading-relaxed">
                        {post.content.split(" ").slice(0, 180).join(" ")}...
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500 text-sm">
                          {new Date(post.createdAt).toLocaleDateString()}
                        </span>
                        <Link
                          href={`/feeds/${encodeURIComponent(post.title)}`}
                          className="text-blue-600 hover:text-blue-500 font-medium transition duration-200"
                        >
                          Read More →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            {/* </>
          )} */}
        </div>
      </div>
    </div>
  );
}