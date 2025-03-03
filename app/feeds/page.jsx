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

    if (loading) return <p>Loading posts...</p>;

    return (
        <div className="max-w-3xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Recent Posts</h1>
            {posts.length === 0 ? (
                <p>No posts found.</p>
            ) : (
                <div className="space-y-4">
                    {posts.map((post) => (
                        <div key={post._id} className="border p-4 rounded-lg shadow-md">
                            <h2 className="text-xl font-semibold">
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
    );
}
