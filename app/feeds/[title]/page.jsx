"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { SlUserFollow, SlUserFollowing } from "react-icons/sl";
import ShareButtons from "@/app/components/shareButton";
import { useSession } from "next-auth/react"; 
import LikeComment from "@/app/components/LikeComment";

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

    if (loading) return <p>Loading post...</p>;
    if (!post) return <p>Post not found.</p>;

    return (
<div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-xl">
    <h1 className="text-4xl font-extrabold text-gray-900 mb-4">{post.title}</h1>
    <div className="flex items-center justify-between mb-6">
        <p className="text-black font-bold">
            <span className="text-ms">Author: {post.authorEmail} </span>
            {session && (
                <button
                onClick={handleFollow}
                className={`ml-3 p-2 rounded-full transition ease-in-out duration-300 
                ${isFollowing ? 'bg-blue-500 hover:bg-blue-600 text-white' : 'bg-white border-2 border-gray-300 hover:bg-gray-100'}`}
            >
                    {isFollowing ? <SlUserFollowing size={25} /> : <SlUserFollow  size={25} />}
                </button>
            )}
        </p>
        <p className="text-ms text-black">
            <span className="text-ms font-bold">Date: {new Date(post.createdAt).toLocaleDateString()} </span> 
        </p>
    </div>
    <p className="text-lg text-gray-800 leading-relaxed mb-6">{post.content}</p>
    <div className="mt-8">
        <ShareButtons />
    </div>

    <LikeComment title={post.title} />

</div>

    );
}
