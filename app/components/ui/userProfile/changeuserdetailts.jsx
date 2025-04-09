"use client";
import React, {useState, useEffect} from "react";
import {useSession} from "next-auth/react";
export default function ChangeUserDetails() {
    const {data: session} = useSession();
    const [newName, setNewName] = useState(""); //later phone,address, etc
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    
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
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({name: newName}),
        });
    
        if (response.ok) {
            setMessage("Name updated successfully!");
            // Optionally, you can refresh the session or redirect the user
        } else {
            const data = await response.json();
            setMessage(data.error || "Failed to update name.");
        }
        } catch (error) {
        console.error("Error updating name:", error);
        setMessage("An error occurred while updating the name.");
        } finally {
        setLoading(false);
        }
    };
    
    return (
        <div className="flex flex-col items-center">
            <span className="font-medium text-gray-800">Current Name:</span>{" "}
            {session?.user?.firstname}
        <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Enter new name"
            className="border rounded p-2 mb-2"
        />
        <button
            onClick={handleUpdate}
            disabled={loading}
            className={`bg-blue-500 text-white p-2 rounded ${loading ? "opacity-50" : ""}`}
        >
            {loading ? "Updating..." : "Update Name"}
        </button>
        {message && <p className="text-red-500 mt-2">{message}</p>}
        </div>
    );
}