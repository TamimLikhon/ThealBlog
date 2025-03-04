"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
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

    if (loading) return <p>Loading posts...</p>;

    return (
        <div className="relative flex justify-center items-center min-h-screen bg-gray-100 p-6">
                    {!session ? (
                        <div className="absolute inset-0 flex flex-col justify-center items-center bg-gray-900 bg-opacity-50 backdrop-blur-md text-white text-center p-6">
                            <h1 className="text-3xl font-bold mb-3">Oops! You're not logged in</h1>
                            <p className="mb-4">Please sign in to create a post.</p>
                            <button 
                                onClick={() => signIn()} 
                                className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-md font-semibold">
                                Login
                            </button>
                        </div>
                    ) : (
                <div className="space-y-4">
                    {posts.map((post) => (
                        <div key={post._id} className="border p-4 rounded-lg shadow-md">
                            <h2>
                        <Link href={`/myblog/${encodeURIComponent(post.title)}`} className="text-blue-600 hover:underline">
                            {post.title}
                        </Link>
                    </h2>
                            <p className="text-sm text-gray-500">Date: {new Date(post.createdAt).toLocaleDateString()}</p>
                            <p className="mt-2">{post.content}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
