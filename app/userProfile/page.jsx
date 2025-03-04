"use client";
import { useState } from "react";
import { useSession, signIn } from "next-auth/react";


function UserProfile({ session, newName, setNewName, handleUpdate, loading, message }) {
    return (
        <div>
            <h1>Profile</h1>
            <p>Current Name: {session?.user?.firstname}</p>
            <input
                type="text"
                placeholder="Enter new name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
            />
            <button onClick={handleUpdate} disabled={loading}>
                {loading ? "Updating..." : "Update Name"}
            </button>
            <p>{message}</p>
        </div>
    );
}

export default function Profile() {
    const { data: session, update } = useSession();
    const [newName, setNewName] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

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
                <UserProfile 
                    session={session} 
                    newName={newName} 
                    setNewName={setNewName} 
                    handleUpdate={handleUpdate} 
                    loading={loading} 
                    message={message} 
                />
            )}
        </div>
    );
}