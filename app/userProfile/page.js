"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";

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
                    email: session?.user?.email, // User's email
                    firstname: newName, // Corrected here
                }),
            });

            const data = await response.json();
            if (response.ok) {
                setMessage("Firstname updated successfully!");
                update(); // Refresh session data
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
