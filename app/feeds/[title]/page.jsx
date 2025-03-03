"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function PostPage() {
    const { title } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                // No need to manually encode title
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

    if (loading) return <p>Loading post...</p>;
    if (!post) return <p>Post not found.</p>;

    return (
        <div className="max-w-2xl mx-auto p-4">
            <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
            <p className="text-sm text-gray-500 mb-4">
                Author: {post.authorEmail} | Date: {new Date(post.createdAt).toLocaleDateString()}
            </p>
            <p className="text-lg">{post.content}</p>
        </div>
    );
}
