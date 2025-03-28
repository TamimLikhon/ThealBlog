"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { SlUserFollow, SlUserFollowing } from "react-icons/sl";
import ShareButtons from "@/app/components/shareButton";
import { useSession } from "next-auth/react"; 
import LikeComment from "@/app/components/LikeComment";
import Image from "next/image";
import DOMPurify from "dompurify";

export default function PostPage() {
    const { title } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const { data: session } = useSession();
    const [isFollowing, setIsFollowing] = useState(false);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await fetch(`/api/fetchpost?title=${title}`);
                const data = await response.json();
                setPost(data);
            } catch (error) {
                console.error("Error fetching post:", error);
            } finally {
                setLoading(false);
            }
        };

        if (title) {
            fetchPost();
        }
    }, [title]);

    useEffect(() => {
        const checkFollowingStatus = async () => {
            if (!session?.user?.email || !post?.authorEmail) return;

            try {
                const response = await fetch("/api/following");
                const data = await response.json();
                
                if (response.ok && Array.isArray(data.following)) {
                    setIsFollowing(data.following.includes(post.authorEmail));
                }
            } catch (error) {
                console.error("Error checking follow status:", error);
            }
        };

        if (session && post) {
            checkFollowingStatus();
        }
    }, [session, post]);

    const handleFollow = async () => {
        if (!session) {
            alert("You need to sign in first.");
            return;
        }

        try {
            const response = await fetch("/api/follow", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${session.user.token}`,
                },
                body: JSON.stringify({ authorEmail: post.authorEmail }),
            });

            const data = await response.json();
            if (response.ok) {
                setIsFollowing(!isFollowing);
            } else {
                alert(data.error);
            }
        } catch (error) {
            console.error("Error following user:", error);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
            </div>
        );
    }
    if (!post) return <p>Post not found.</p>;//custom error page

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12 px-4 sm:px-6">
            <h1 className="text-4xl font-extrabold text-white mb-4">{post.title}</h1>
            <div className="flex items-center justify-between mb-6">
                <p className="font-bold">
                    <span className="text-ms text-white">Author: {post.authorEmail} </span>
                    {session && session.user.email !== post.authorEmail && (
                        <button
                            onClick={handleFollow}
                            className={`ml-3 p-2 rounded-full transition ease-in-out duration-300 
                            ${isFollowing ? 'bg-blue-500 hover:bg-blue-600 text-white' : 'bg-white border-2 border-gray-300 hover:bg-gray-100'}`}
                        >
                            {isFollowing ? <SlUserFollowing size={25} /> : <SlUserFollow size={25} />}
                        </button>
                    )}
                </p>
                <p className="text-ms text-white">
                    <span className="text-ms font-bold">Date: {new Date(post.createdAt).toLocaleDateString()} </span> 
                </p>
            </div>

            <Image
                src={post.imageUrl}
                alt={post.imageUrl}
                className="w-fit rounded-2xl shadow-2xl mx-auto mb-10"
                width={800}
                height={500}
                priority={true}
                quality={75}
            />

            {/* Render sanitized content */}
            <div 
                className="text-lg text-white leading-relaxed" 
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content) }} 
            />

            <LikeComment title={post.title} />
            <div className="text-white">
                <ShareButtons />
            </div>
        </div>
    );
}
