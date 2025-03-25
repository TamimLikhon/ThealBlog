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
                    response.ok ? setPosts(data) : setMessage(data.message || "No posts found.");
                } catch (error) {
                    setMessage("Failed to fetch posts.");
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

    if (loading){
        
            return (
                <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
                </div>
            );
        }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12 px-4 sm:px-6">
            <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-4">
                
                <h1 className="text-4xl font-bold text-white">My Blogs</h1>
                            </div>
            <div className="">
                {!session ? (
                    <div className="rounded-lg py-12 px-6 text-center shadow-md">
                        <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        <h1 className="text-3xl font-semibold text-gray-800">You're not logged in</h1>
                        <p className="text-gray-500 mt-2 mb-6">Sign in to manage your blog posts.</p>
                        <button 
                            onClick={() => signIn()} 
                            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg text-white font-medium transition-all">
                            Login to Dashboard
                        </button>
                    </div>
                ) : (
                    <>


                        {posts.length === 0 ? (
                            <div className="bg-blue-600/20 text-blue-300 text-sm px-4 py-1.5 rounded-full font-medium border border-blue-500/30">
                                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path>
                                </svg>
                                <p className="text-gray-500 mb-4">No blog posts found.</p>
                                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
                                    Create Your First Post
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 ">
                                {posts.map((post) => (
                                    <div key={post._id} className="p-6 bg-gray-800 rounded-xl shadow-md border hover:shadow-lg transition-all">
                                        <h2 className="text-2xl text-white font-semibold mb-2">
                                            <Link href={`/myblog/${encodeURIComponent(post.title)}`} className="hover:underline">
                                                {post.title}
                                            </Link>
                                        </h2>
                                        
                                        <div className="flex items-center text-sm text-gray-500 mb-3">
                                            <span className="mr-2"></span>
                                            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        
                                        <p className="text-white mb-4">
                                            {post.content.split(" ").slice(0, 30).join(" ")}...
                                        </p>

                                        <div className="flex justify-between items-center">
                                            <Link href={`/myblog/${encodeURIComponent(post.title)}`} className="text-blue-600 hover:text-blue-800 font-medium">
                                                Read More →
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
