"use client";
import { useEffect, useState } from "react";

export default function StaticPost() {
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

    if (loading) return <p className="text-center text-gray-600 text-lg">Loading...</p>;
    if (error) return <p className="text-center text-red-500 text-lg">Error: {error}</p>;

    return (
        <div className="max-w-4xl mx-auto py-10">
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">AI Category Posts</h1>
            
            {posts.length > 0 ? (
                <div className="space-y-6">
                    {posts.map((post) => (
                        <div key={post._id} className="bg-white shadow-lg rounded-lg p-6 border border-gray-200">
                            
                            <h2 className="text-2xl font-semibold text-gray-900">{post.title}</h2>
                            <p className="text-black mt-2">{post.content}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-center text-gray-600">No posts available in this category.</p>
            )}
        </div>
    );
}
