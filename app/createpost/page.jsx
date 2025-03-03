"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
export default function CreatePost() {
    const { data: session } = useSession();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleCreatePost = async () => {
        if (!title.trim() || !content.trim()) {
            setMessage("Please enter a valid title and content.");
            return;
        }
    
        setLoading(true);
        setMessage("");
    
        try {
            const response = await fetch("/api/createpost", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title,
                    content,
                    authorEmail: session?.user?.email,
                }),
            });
    
            const data = await response.json();
            setMessage(data.message);
            
            if (response.ok) {
                setTitle("");
                setContent("");
            }
        } catch (error) {
            setMessage("Failed to create post.");
            console.error("Failed to create post:", error);
        } finally {
            setLoading(false);
        }
    };
    

    return(
        <div>
            <h1>Create Post</h1>
            <input
                type="text"
                placeholder="Enter title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
                placeholder="Enter content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
            />
            <button onClick={handleCreatePost} disabled={loading}>
                {loading ? "Creating..." : "Create Post"}
            </button>
            <p>{message}</p>
        </div>
    )

}