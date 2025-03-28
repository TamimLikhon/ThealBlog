import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function CryptoNewsFetch() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`/api/categoryfetch?category=Crypto`);
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

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 w-48 mb-4"></div>
          <div className="h-64 bg-gray-200 w-full"></div>
        </div>
      </div>
    );

  if (error)
    return <p className="text-center text-red-500 text-lg">Error: {error}</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-left border-b-2 border-black pb-4 mb-8">
        Voice of Crypto
      </h1>

      {posts.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Featured Post */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border-2 border-black rounded-lg overflow-hidden">
              <div className="relative pt-[56.25%]">
                {" "}
                {/* 16:9 Aspect Ratio */}
                <Image
                  src={posts[0].imageUrl}
                  alt={posts[0].title}
                  fill
                  className="absolute inset-0 w-full h-full object-cover"
                  priority={true}
                  quality={90}
                />
              </div>
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-4">
                  <Link
                    href={`/feeds/${encodeURIComponent(posts[0].title)}`}
                    className="hover:opacity-70 transition-opacity"
                  >
                    {posts[0].title}
                  </Link>
                </h2>
                <p className="text-base opacity-90">
                  {truncateText(posts[0].metadata, 250)}
                </p>
              </div>
            </div>
          </div>

          {/* Side Posts */}
          <div className="space-y-6">
            {posts.slice(1, 3).map((post) => (
              <div
                key={post._id}
                className="bg-white border-2 border-black rounded-lg p-2"
              >
                <div className="relative pt-[56.25%]">
                  {" "}
                  {/* 16:9 Aspect Ratio */}
                  <Image
                    src={post.imageUrl}
                    alt={post.title}
                    fill
                    className="absolute inset-0 w-full h-full object-cover"
                    priority={true}
                    quality={90}
                  />
                </div>
                <h2 className="text-xl font-bold mb-3">
                  <Link
                    href={`/feeds/${encodeURIComponent(post.title)}`}
                    className="hover:opacity-70 transition-opacity"
                  >
                    {post.title}
                  </Link>
                </h2>
                <p className="text-base opacity-90">
                  {truncateText(post.metadata)}
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-600">
          No Crypto news available at the moment.
        </p>
      )}
    </div>
  );
}
