"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Feeds() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch("/api/fetchpost");
                const data = await response.json();
                setPosts(data);
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
            <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12 px-4 sm:px-6">
            <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-4">
                
                    <h1 className="text-4xl font-bold text-white">Feeds</h1>
                                </div>

            {posts.length === 0 ? (
                <div className="text-center py-16 border border-gray-700 rounded-xl bg-gray-800">
                    <h2 className="text-2xl font-semibold mb-3">No content available</h2>
                    <p className="text-gray-400 text-lg">Check back soon for exclusive insights.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 ">
                    {posts.map((post) => (
                        <div key={post._id} className="p-6 bg-gray-800 rounded-xl shadow-md border border-gray-700 hover:shadow-lg transition-all">
                            <h2 className="text-2xl font-bold mb-4 hover:text-blue-400 transition-colors">
                                <Link href={`/feeds/${encodeURIComponent(post.title)}`} className="hover:underline text-white">
                                    {post.title}
                                </Link>
                            </h2>
                            <p className="text-gray-300 mb-6">{post.content.split(" ").slice(0, 30).join(" ")}...</p>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-400 text-sm">{new Date(post.createdAt).toLocaleDateString()}</span>
                                <Link href={`/feeds/${encodeURIComponent(post.title)}`} className="text-blue-400 hover:text-blue-300 font-medium transition">
                                    Read More →
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
