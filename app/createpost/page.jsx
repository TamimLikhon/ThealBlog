"use client";
import { useState } from "react";
import { useSession, signIn } from "next-auth/react";
import TiptapEditor from "../components/Tiptap";
import Upload from "../uploads/page";

export default function CreatePost() {
    const { data: session, status } = useSession();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState(""); // Rich text content
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleCreatePost = async () => {
        setMessage("");
        setError("");

        if (!title.trim() || !content.trim()) {
            setError("Title and content cannot be empty.");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch("/api/createpost", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title,
                    content, // This now contains formatted HTML from Tiptap
                    authorEmail: session?.user?.email,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage("Post created successfully!");
                setTitle("");
                setContent(""); // Clear content after success
            } else {
                setError(data.message || "Failed to create post.");
            }
        } catch (error) {
            setError("Something went wrong.");
            console.error("Failed to create post:", error);
        } finally {
            setLoading(false);
        }
    };

    if (status === "loading") return <p className="text-center mt-10">Checking authentication...</p>;

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
                <div className="max-w-2xl w-full bg-white rounded-lg shadow-md p-6">
                    <h1 className="text-3xl font-bold text-center mb-4">Create a New Post</h1>
                    {/* <Upload /> */}
                    <div className="mb-4">
                        <label className="block text-gray-700 font-medium mb-1">Title</label>
                        <input
                            type="text"
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            maxLength={100}
                        />
                        <p className="text-xs text-gray-500 mt-1">{title.length}/100</p>
                    </div>

                    <div className="mt-10">
                        <TiptapEditor content={content} setContent={setContent} className="w-2xl" />
                    </div>

                    {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
                    {message && <p className="text-green-500 text-sm mb-3">{message}</p>}

                    <button
                        onClick={handleCreatePost}
                        disabled={loading}
                        className={`w-full p-3 text-white font-semibold rounded-md transition ${
                            loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                        }`}
                    >
                        {loading ? "Creating..." : "Create Post"}
                    </button>
                </div>
            )}
        </div>
    );
}
