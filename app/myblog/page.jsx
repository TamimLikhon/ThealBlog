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
<div className="min-h-screen bg-gray-50 py-8">
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg">
        {!session ? (
            <div className="bg-gray-50 rounded-lg py-12 px-6 text-center border border-gray-100">
                <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <h1 className="text-2xl font-bold mb-3 text-gray-800">Oops! You're not logged in</h1>
                <p className="text-gray-500 mb-6">Please sign in to view your personal blog dashboard.</p>
                <button 
                    onClick={() => signIn()} 
                    className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold text-white transition-all duration-200">
                    <span className="flex items-center justify-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
                        </svg>
                        Login to Dashboard
                    </span>
                </button>
            </div>
        ) : (
            <>
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">My Blogs</h1>
                        <p className="text-gray-600 mt-1">Manage and monitor all your blog posts in one place.</p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <button className="bg-gray-100 hover:bg-gray-200 p-2 rounded-lg text-gray-700 transition-all">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                            </svg>
                        </button>
                        <button className="bg-gray-100 hover:bg-gray-200 p-2 rounded-lg text-gray-700 transition-all">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4"></path>
                            </svg>
                        </button>
                    </div>
                </div>

                <div className="mb-4">
                    <div className="flex justify-between items-center">
                        <div className="text-gray-700">
                            <span className="font-medium">{posts.length}</span> posts available
                        </div>
                        <div className="flex space-x-2">
                            <button className="text-gray-500 hover:text-gray-700">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path>
                                </svg>
                            </button>
                            <button className="text-gray-500 hover:text-gray-700">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {posts.length === 0 ? (
                    <div className="bg-gray-50 rounded-lg py-12 px-6 text-center border border-gray-100">
                        <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path>
                        </svg>
                        <p className="text-gray-500 mb-4">No blog posts found in your account.</p>
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium inline-flex items-center">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                            </svg>
                            Create Your First Post
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {posts.map((post) => (
                            <div key={post._id} className="bg-white border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden p-5">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <h2 className="text-xl font-semibold text-gray-800 mb-2 hover:text-blue-600 transition-colors">
                                            <Link href={`/myblog/${encodeURIComponent(post.title)}`} className="hover:underline">
                                                {post.title}
                                            </Link>
                                        </h2>
                                        
                                        <div className="flex items-center text-sm text-gray-500 mb-3">
                                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                            </svg>
                                            <span>{new Date(post.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                                        </div>
                                        
                                        <p className="text-gray-600 line-clamp-3">
                                            {post.content.split(" ").slice(0, 50).join(" ")}...
                                        </p>
                                    </div>
                                    
                                    <div className="ml-4 shrink-0">
                                        <div className="flex space-x-1">
                                            <button className="text-gray-400 hover:text-blue-600 p-1">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                                </svg>
                                            </button>
                                            <button className="text-gray-400 hover:text-red-600 p-1">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="mt-4 flex justify-between items-center">
                                    <Link href={`/myblog/${encodeURIComponent(post.title)}`} className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium">
                                        Read More
                                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                                        </svg>
                                    </Link>
                                    
                                    <div className="flex items-center text-sm text-gray-400">
                                        <span className="flex items-center mr-3">
                                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                                            </svg>
                                            {Math.floor(Math.random() * 100)}
                                        </span>
                                        <span className="flex items-center">
                                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
                                            </svg>
                                            {Math.floor(Math.random() * 10)}
                                        </span>
                                    </div>
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
