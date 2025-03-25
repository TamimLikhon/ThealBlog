"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import TiptapEditor from "@/app/components/Tiptap";
import ShareButtons from "@/app/components/shareButton";
export default function MyIndipost() {
    const { title } = useParams();
    const { data: session } = useSession();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [newTitle, setNewTitle] = useState("");
    const [newContent, setNewContent] = useState("");

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await fetch(`/api/fetchpost?title=${title}`);
                const data = await response.json();
                setPost(data);
                setNewTitle(data.title);
                setNewContent(data.content);
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

    const handleUpdate = async () => {
        try {
            const response = await fetch("/api/mypostsedit", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: session?.user?.email,
                    currentTitle: post.title, // Send current title
                    newTitle: newTitle,
                    newContent: newContent,
                }),
            });
    
            const data = await response.json();
            if (response.ok) {
                setPost({ ...post, title: newTitle, content: newContent });
                setIsEditing(false);
            } else {
                console.error("Error updating post:", data.error);
            }
        } catch (error) {
            console.error("Error updating post:", error);
        }
    };
    

    if (loading) return <p>Loading post...</p>;
    if (!post) return <p>Post not found.</p>;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12 px-4 sm:px-6">
            {isEditing ? (
                <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full text-3xl font-bold mb-2 p-2 border rounded"
                />
            ) : (
                <h1 className="text-3xl text-white font-bold mb-2">{post.title}</h1>
            )}
            <p className="text-sm text-white mb-4">
                Author: {post.authorEmail} | Date: {new Date(post.createdAt).toLocaleDateString()} | updated: {new Date(post.updatedAt).toLocaleDateString()}
            </p>
            {isEditing ? (
                                        <TiptapEditor content={newContent} setContent={setNewContent} />

            ) : (
                <p className="text-lg text-white">{post.content}</p>
            )}
            {session?.user?.email === post.authorEmail && (
                <div className="mt-4">
                    {isEditing ? (
                        <button onClick={handleUpdate} className="bg-green-500 text-white px-4 py-2 rounded mr-2">Save</button>
                    ) : (
                        <button onClick={() => setIsEditing(true)} className="bg-blue-500 text-white px-4 py-2 rounded">Edit</button>
                    )}
                </div>
            )}
            <ShareButtons />
        </div>
    );
}
