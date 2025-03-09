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
        <div className="relative flex justify-center items-center min-h-screen bg-gray-100 p-6">
            {!session ? (
                <div className="absolute inset-0 flex flex-col justify-center items-center bg-gray-900 bg-opacity-50 backdrop-blur-md text-white text-center p-6">
                    <h1 className="text-3xl font-bold mb-3">Oops! You're not logged in</h1>
                    <p className="mb-4">Please sign in to view posts from people you follow.</p>
                    <button 
                        onClick={() => signIn()} 
                        className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-md font-semibold">
                        Login
                    </button>
                </div>
            ) : (
                <div className="max-w-2xl w-full bg-white rounded-lg shadow-md p-6">
                    <h1 className="text-3xl font-bold text-center mb-4">Following Posts</h1>

                    {loading ? (
                        <p className="text-center text-gray-500">Loading...</p>
                    ) : ffeeds.length === 0 ? (
                        <p className="text-center text-gray-500">No posts found from followed users.</p>
                    ) : (
                        <div className="space-y-6">
                            {ffeeds.map((post) => (
                                <div key={post._id} className="border p-4 rounded-lg shadow-md bg-gray-50">
                                    <h2 className="text-xl font-semibold text-gray-800">
                                        <Link href={`/feeds/${encodeURIComponent(post.title)}`} className="text-blue-600 hover:underline">
                                            {post.title}
                                        </Link>
                                    </h2>
                                    <p className="text-sm text-gray-500">
                                        Author: {post.authorEmail} | Date: {new Date(post.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
