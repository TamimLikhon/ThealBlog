"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import UserProfilePic from "./userprofilepic";
import { RiDeleteBin6Line } from "react-icons/ri";

export default function ChangeProfilePic() {
    const [imageUrl, setImageUrl] = useState("");  // ✅ State to track image URL
    const { data: session } = useSession();
    const [errorMessage, setErrorMessage] = useState("");

    // Function to handle image deletion
    const handleImageDelete = async () => {
        if (!session?.user?.email) {
            setErrorMessage("Ensure you are logged in.");
            return;
        }

        try {
            const response = await fetch("/api/auth/image", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: session.user.email }),
            });

            const data = await response.json();
            if (response.ok) {
                setImageUrl("");  // ✅ Immediately update state (no reload)
                console.log("Image deleted successfully!");
            } else {
                setErrorMessage(data.message || "Failed to delete profile picture.");
            }
        } catch (error) {
            setErrorMessage("An error occurred while deleting the image.");
        }
    };

    // Fetch the image on component mount
    useEffect(() => {
        if (!session?.user?.email) return;

        const fetchImage = async () => {
            try {
                const res = await fetch(`/api/auth/image?email=${session.user.email}`);
                const data = await res.json();

                setImageUrl(data?.imageUrl || "");  // ✅ Correctly update state
            } catch (error) {
                console.error("Error fetching image:", error);
            }
        };

        fetchImage();
    }, [session?.user?.email]);

    return (
        <div className="flex flex-col items-center">
            {imageUrl ? (
                <div className="relative group h-50 w-50 overflow-hidden rounded-full ring-2 ring-gray-200 shadow-md">
                    <Image
                        src={imageUrl}  // ✅ Corrected source
                        alt="Profile Picture"
                        fill
                        className="object-cover"
                    />
                    {/* Delete button overlay */}
                    <div 
                        className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    >
                        <button 
                            onClick={handleImageDelete} 
                            className="text-white p-2 rounded-full bg-red-500"
                        >
                            <RiDeleteBin6Line size={24} />
                        </button>
                    </div>
                </div>
            ) : (
                <UserProfilePic /> // ✅ Shows upload section if no image
            )}

            {/* Display error message if any */}
            {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
        </div>
    );
}
