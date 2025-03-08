"use client";
import { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import Link from "next/link";

export default function MyBlog() {
    const { data: session } = useSession();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (session) {
            const fetchMyPosts = async () => {
                try {
                    const response = await fetch(`/api/myposts?email=${session.user.email}`);
                    const data = await response.json();

                    if (response.ok) {
                        setPosts(data);
                    } else {
                        setMessage(data.message || "No posts found.");
                    }
                } catch (error) {
                    setMessage("Failed to fetch posts.");
                    console.error("Error fetching posts:", error);
                } finally {
                    setLoading(false);
                }
            };

            fetchMyPosts();
        } else {
            setLoading(false);
            setMessage("You must be logged in to view your posts.");
        }
    }, [session]);

    if (loading) return <p className="text-center text-gray-600">Loading posts...</p>;

    return (
<div className="min-h-screen bg-gray-900 bg-opacity-50 flex justify-center items-center p-6">
    {!session ? (
        <div className="flex flex-col justify-center items-center text-center p-6">
            <h1 className="text-3xl font-bold mb-3 text-white">Oops! You're not logged in</h1>
            <p className="mb-4 text-gray-300">Please sign in to view your posts.</p>
            <button 
                onClick={() => signIn()} 
                className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-md font-semibold text-white">
                Login
            </button>
        </div>
    ) : (
        <div className="max-w-3xl w-full bg-white p-8 rounded-lg shadow-xl">
            <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">My Blogs</h1>

            {posts.length === 0 ? (
                <p className="text-gray-500 text-center">No posts available.</p>
            ) : (
                <div className="space-y-6">
                    {posts.map((post) => (
                        <div key={post._id} className="bg-gray-50 rounded-lg shadow-md p-6 transition hover:shadow-xl">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                                <Link href={`/myblog/${encodeURIComponent(post.title)}`} className="hover:text-blue-600 transition">
                                    {post.title}
                                </Link>
                            </h2>
                            <p className="text-sm text-gray-500">Published on {new Date(post.createdAt).toLocaleDateString()}</p>
                            
                            <p className="text-gray-700 mt-3">
                                {post.content.split(" ").slice(0, 100).join(" ")}...
                                <Link href={`/myblog/${encodeURIComponent(post.title)}`} className="text-blue-600 font-semibold ml-1">
                                    Read More
                                </Link>
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
