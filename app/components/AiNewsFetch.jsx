"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function AINews() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`/api/categoryfetch?category=AI`);
        if (!response.ok) {
          throw new Error("No posts found");
        }
        const data = await response.json();
        setPosts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  // Truncate text function
  const truncateText = (text, maxLength = 150) => {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + "...";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48 sm:h-64">
        <div className="animate-pulse space-y-4">
          <div className="h-6 sm:h-8 bg-gray-200 w-32 sm:w-48 rounded"></div>
          <div className="h-40 sm:h-64 bg-gray-200 w-full sm:w-80 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return <p className="text-center text-red-500 text-base sm:text-lg">Error: {error}</p>;
  }

  return (
    <div className="w-full px-4 sm:px-6 py-6 sm:py-8">
      <h1 className="text-xl sm:text-2xl font-bold text-left border-b-2 border-black pb-3 sm:pb-4 mb-6 sm:mb-8">
        Voice of AI
      </h1>

      {posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {/* Featured Post */}
          <div className="md:col-span-2 space-y-4 sm:space-y-6">
            <div className="bg-white border-2 border-black rounded-lg overflow-hidden">
              <div className="relative pt-[56.25%]">
                <Image
                  src={posts[0].imageUrl}
                  alt={posts[0].title}
                  fill
                  className="absolute inset-0 w-full h-full object-cover"
                  priority={true}
                  quality={85}
                />
              </div>
              <div className="p-4 sm:p-6">
                <Link
                  href={`/feeds/${encodeURIComponent(posts[0].title)}`}
                  className="hover:opacity-70 transition-opacity block"
                >
                  <h2 className="text-lg sm:text-2xl font-semibold mb-2 sm:mb-4 line-clamp-2">
                    {posts[0].title}
                  </h2>
                  <p className="text-gray-800 font-medium text-sm sm:text-base">
                    {truncateText(posts[0].metadata, 200)}
                  </p>
                </Link>
              </div>
            </div>
          </div>

          {/* Secondary Posts */}
          <div className="space-y-4 sm:space-y-6">
            {posts.slice(1, 3).map((post) => (
              <div
                key={post._id}
                className="bg-white border-2 border-black rounded-lg overflow-hidden"
              >
                <div className="relative pt-[56.25%]">
                  <Image
                    src={post.imageUrl}
                    alt={post.title}
                    fill
                    className="absolute inset-0 w-full h-full object-cover"
                    quality={85}
                  />
                </div>
                <div className="p-3 sm:p-4">
                  <Link
                    href={`/feeds/${encodeURIComponent(post.title)}`}
                    className="hover:opacity-70 transition-opacity block"
                  >
                    <h2 className="text-base sm:text-xl font-semibold mt-2 sm:mt-3 mb-2 sm:mb-3 line-clamp-2">
                      {post.title}
                    </h2>
                    <p className="text-gray-800 font-medium text-xs sm:text-sm">
                      {truncateText(post.metadata)}
                    </p>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-600 text-base sm:text-lg">
          No AI news available at the moment.
        </p>
      )}
    </div>
  );
}