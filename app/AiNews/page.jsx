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

  if (error) return <p className="text-center text-red-500 text-lg">Error: {error}</p>;

  return (
    <div className="container mx-auto px-28 py-20">
      <h1 className="text-3xl font-bold text-left text-gray-800">AI News</h1>
      
      {posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* First post with image */}
          <div className="md:col-span-2 bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
          <Image
  src={posts[0].imageUrl}
  alt={posts[0].title}
  width={600}
  height={300}
  className="w-full h-125 object-cover object-center"
  priority={true}
  quality={100}
/>

            <div className="p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              <Link href={`/feeds/${encodeURIComponent(posts[0].title)}`} className="hover:underline text-black">
                              {posts[0].title}
                                </Link>
                </h2>
              <p className="text-black">{posts[0].metadata}</p>
            </div>
          </div>

          {/* Next two posts with only title and metadata */}
          <div className="space-y-6">
            {posts.slice(1, 3).map((post) => (
              <div 
                key={post._id} 
                className="bg-white shadow-lg rounded-lg p-6 border border-gray-200"
              >
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                <Link href={`/feeds/${encodeURIComponent(post.title)}`} className="hover:underline text-black">
                                    {post.title}
                                </Link>
                </h2>
                <p className="text-black">{post.metadata}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-600">No posts available in this category.</p>
      )}
    </div>
  );
}