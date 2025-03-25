"use client";
import { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import Link from "next/link";
import { Calendar, User, ChevronRight, Loader } from "lucide-react";
import LikeComment from "../components/LikeComment";
import { useParams } from "next/navigation";

export default function CustomFeeds() {
  const  {title} = useParams();
    const { data: session } = useSession();
    const [ffeeds, setFfeeds] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!session?.user?.email) return;

            try {
                const res = await fetch('/api/following-feeds');
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

    if (loading){
        
      return (
          <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
          </div>
      );
  }

    return (
<div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12 px-4 sm:px-6">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
    {!session ? (
      <div className="rounded-xl overflow-hidden bg-gray-800 ">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-10 py-16 text-center">
          <h1 className="text-4xl font-extrabold text-white mb-4">Unlock Exclusive Content</h1>
          <p className="text-gray-200 text-lg mb-8 max-w-lg mx-auto">
            Sign in to explore your personalized premium feed.
          </p>
          <button
            onClick={() => signIn()}
            className="px-6 py-3 text-lg font-semibold rounded-lg text-white bg-white/20 hover:bg-white/30 border border-white/10 transition-all duration-200"
          >
            Sign In
          </button>
        </div>
      </div>
    ) : (
      <div className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">Following Feeds</h1>
        </div>
        <div className="space-y-6">
          {ffeeds.map((post) => (
            <div key={post._id} className="p-6">
              <div className="px-6 py-4 flex items-start">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                  {post.authorEmail.charAt(0).toUpperCase()}
                </div>
                <div className="ml-5 flex-1">
                  <Link href={`/feeds/${encodeURIComponent(post.title)}`} className="block group">
                    <h2 className="text-2xl font-semibold text-white hover:text-blue-300 transition-colors duration-150">
                      {post.title}
                    </h2>
                    </Link>
                  <div className="mt-2 flex items-center text-sm text-white">
                    <User className="h-4 w-4 mr-1.5" />
                    <span>{post.authorEmail}</span>
                    <span className="mx-2">•</span>
                    <Calendar className="h-4 w-4 mr-1.5" />
                    <time dateTime={post.createdAt}>
                      {new Date(post.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </time>
                  </div>
                  <p className="text-gray-300 mt-5">{post.content}</p>

                </div>
              </div>
              <LikeComment title={post.title} />
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
</div>

    );
}