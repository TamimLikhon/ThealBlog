"use client";
import { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import Link from "next/link";
import { Calendar, User } from "lucide-react";
import LikeComment from "../components/LikeComment";
import { useParams } from "next/navigation";
import Image from "next/image";

export default function CustomFeeds() {
  const { title } = useParams();
  const { data: session } = useSession();
  const [ffeeds, setFfeeds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!session?.user?.email) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("/api/following-feeds");
        const data = await res.json();
        setFfeeds(data);
      } catch (error) {
        console.error("Error fetching following feeds:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [session]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white text-black">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-40 mb-6 rounded-lg"></div>

      {!session ? (
            <div className="flex flex-col justify-center items-center text-center p-10 bg-white rounded-lg shadow-xl max-w-md mx-auto -mt-24">
          <p className="text-black mb-6 text-lg">Please sign in to vibe.</p>
          <button
            onClick={() => signIn()}
            className="bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded-md font-semibold text-white transition duration-200 w-full"
          >
            Sign In
          </button>
        </div>
      ) : (
        <div className="w-full max-w-screen-md mx-auto space-y-10">
          {ffeeds.map((post) => {
            const words = post.content.split(" ");
            const preview = words.slice(0, 180).join(" ") + (words.length > 180 ? "..." : "");

            return (
              <div key={post._id} className="bg-white p-6 rounded-xl shadow border border-gray-200">
                <div className="flex items-start mb-4">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                    {post.authorEmail.charAt(0).toUpperCase()}
                  </div>
                  <div className="ml-4">
                    <Link href={`/feeds/${encodeURIComponent(post.title)}`} className="group">
                      <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                        {post.title}
                      </h2>
                    </Link>
                    <div className="mt-1 flex items-center text-sm text-gray-500">
                      <User className="h-4 w-4 mr-1.5" />
                      <span>{post.authorEmail}</span>
                      <span className="mx-2">•</span>
                      <Calendar className="h-4 w-4 mr-1.5" />
                      <time dateTime={post.createdAt}>
                        {new Date(post.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </time>
                    </div>
                  </div>
                </div>

                {post.imageUrl && (
                  <Image
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-full h-auto rounded-lg shadow mb-5"
                    width={800}
                    height={500}
                    priority={true}
                    quality={75}
                  />
                )}

                <p className="text-gray-700 text-base mb-4">{preview}</p>

                <div className="flex justify-between items-center">
                  <Link
                    href={`/feeds/${encodeURIComponent(post.title)}`}
                    className="text-blue-600 hover:underline font-medium"
                  >
                    Read More →
                  </Link>
                </div>

                <LikeComment title={post.title} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
