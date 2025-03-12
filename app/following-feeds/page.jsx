"use client";
import { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import Link from "next/link";

export default function CustomFeeds() {
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

    return (
<div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-10 px-4 sm:px-6">
  <div className="max-w-3xl mx-auto">
    {!session ? (
      <div className="rounded-xl bg-white shadow-xl overflow-hidden">
        <div className="bg-indigo-600 px-6 py-12 text-center">
          <h1 className="text-3xl font-bold text-white mb-3">Account Required</h1>
          <p className="text-indigo-100 text-lg mb-8">Sign in to access your personalized content feed</p>
          <button 
            onClick={() => signIn()} 
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-md transition-all duration-200">
            Sign In to Continue
          </button>
        </div>
      </div>
    ) : (
      <div className="bg-white rounded-xl shadow-xl overflow-hidden">
        <div className="border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800">Following Feed</h1>
            <span className="bg-indigo-100 text-indigo-800 text-xs px-3 py-1 rounded-full font-medium">
              {ffeeds.length} Posts
            </span>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-12 w-12 rounded-full bg-indigo-200 mb-3"></div>
              <div className="h-4 w-32 bg-indigo-100 rounded"></div>
              <p className="mt-4 text-gray-500">Retrieving your content...</p>
            </div>
          </div>
        ) : ffeeds.length === 0 ? (
          <div className="py-16 px-6 text-center">
            <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No content in your feed</h3>
            <p className="mt-2 text-gray-500 max-w-md mx-auto">Follow more users to see their posts appear in your personalized feed.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {ffeeds.map((post) => (
              <div key={post._id} className="hover:bg-gray-50 transition-colors duration-150">
                <div className="px-6 py-5">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">
                        {post.authorEmail.charAt(0).toUpperCase()}
                      </div>
                    </div>
                    <div className="ml-4 flex-1">
                      <Link href={`/feeds/${encodeURIComponent(post.title)}`} className="block">
                        <h2 className="text-xl font-semibold text-gray-800 hover:text-indigo-600 transition-colors duration-150 group-hover:text-indigo-600">
                          {post.title}
                        </h2>
                      </Link>
                      <div className="mt-1 flex items-center text-sm text-gray-500">
                        <span className="truncate">{post.authorEmail}</span>
                        <span className="mx-1">•</span>
                        <time dateTime={post.createdAt}>
                          {new Date(post.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </time>
                      </div>
                    </div>
                    <div className="ml-2">
                      <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    )}
  </div>
</div>
    );
}
