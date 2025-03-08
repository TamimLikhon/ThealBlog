"use client";
import { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import MyBlog from "../myblog/page";

function UserProfile({ session, newName, setNewName, handleUpdate, loading, message }) {
    return (
        <div className="bg-white shadow-lg rounded-lg p-6 max-w-md w-full">
            <h1 className="text-2xl font-semibold text-gray-800 mb-4">Profile</h1>
            <p className="text-gray-600 mb-2">
                <span className="font-medium text-gray-800">Current Name:</span> {session?.user?.firstname}
            </p>
            
            <div className="flex flex-col gap-4">
                <input
                    type="text"
                    placeholder="Enter new name"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    onClick={handleUpdate}
                    disabled={loading}
                    className={`w-full px-4 py-2 text-white font-semibold rounded-md transition ${
                        loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                    }`}
                >
                    {loading ? "Updating..." : "Update Name"}
                </button>
            </div>

            {message && (
                <p className={`mt-3 text-sm font-medium ${message.includes("successfully") ? "text-green-600" : "text-red-600"}`}>
                    {message}
                </p>
            )}
        </div>
    );
}

export default function Profile() {
    const { data: session, update } = useSession();
    const [newName, setNewName] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [following, setFollowing] = useState([]);

    useEffect(() => {
        if (session) {
            fetchFollowing();
        }
    }, [session]);

    const fetchFollowing = async () => {
        try {
            const response = await fetch("/api/following");
            const data = await response.json();

            if (response.ok) {
                setFollowing(data.following);
            } else {
                console.error("Error fetching following list:", data.error);
            }
        } catch (error) {
            console.error("Network error:", error);
        }
    };

    const handleUpdate = async () => {
        if (!newName.trim()) {
            setMessage("Please enter a valid name.");
            return;
        }

        setLoading(true);
        setMessage("");

        try {
            const response = await fetch("/api/auth/user", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: session?.user?.email,
                    firstname: newName,
                }),
            });

            const data = await response.json();
            if (response.ok) {
                setMessage("Firstname updated successfully!");
                update();
            } else {
                setMessage(data.error || "Failed to update name.");
            }
        } catch (error) {
            setMessage("Network error, please try again.");
            console.error("Network error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center bg-gray-900 bg-opacity-50 min-h-screen">
            {!session ? (
                <div className="flex flex-col justify-center items-center text-center p-6 bg-opacity-10">
                    <h1 className="text-3xl font-bold mb-3 text-white">Oops! You're not logged in</h1>
                    <p className="mb-4 text-white">Please sign in to access your profile.</p>
                    <button 
                        onClick={() => signIn()} 
                        className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-md font-semibold text-white">
                        Login
                    </button>
                </div>
            ) : (
                <div className="w-full max-w-5xl p-8 rounded-lg shadow-xl">
                    <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">My Profile</h1>
                    
                    {/* Profile Info */}
                    <div className="bg-gray-50 rounded-lg shadow-md mb-8">
                        <UserProfile 
                            session={session} 
                            newName={newName} 
                            setNewName={setNewName} 
                            handleUpdate={handleUpdate} 
                            loading={loading} 
                            message={message} 
                        />
                    </div>

                    {/* Following List */}
                    <div className="bg-gray-50 p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Following</h2>
                        {following.length > 0 ? (
                            <ul className="list-disc pl-6 text-gray-700">
                                {following.map((email, index) => (
                                    <li key={index} className="py-1">{email}</li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-600">You're not following anyone yet.</p>
                        )}
                    </div>

                    {/* User Blogs */}
                    <div className="bg-gray-50 p-6 rounded-lg shadow-md mt-8">
                        <MyBlog />
                    </div>
                </div>
            )}
        </div>
    );
}
