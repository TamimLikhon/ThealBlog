"use client";
import React, { useState, useEffect } from "react";
import { Cloudinary } from "@cloudinary/url-gen";
import { useSession, signIn } from "next-auth/react";
import { AdvancedImage, responsive, placeholder } from "@cloudinary/react";
import { X as CloseIcon, AlertCircle as AlertIcon } from "lucide-react";

import CloudinaryUploadWidget from "@/app/components/CloudinaryUploadWidget";

const userprofilepic = () => {
  const cloudName = "drpertfp7";
  const uploadPreset = "uploadImages";
  const { data: session } = useSession();
  const [publicId, setPublicId] = useState("");
  const [imageUrl, setimgURL] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const cld = new Cloudinary({ cloud: { cloudName } });
  const uwConfig = { cloudName, uploadPreset };

  // // Fetch user's current profile image from MongoDB when component loads
  // useEffect(() => {
  //   if (!session?.user?.email) return;

  //   const fetchUserImage = async () => {
  //     try {
  //       const res = await fetch(`/api/auth/image?email=${session.user.email}`);
  //       const data = await res.json();
  //       if (res.ok && data.imageUrl) {
  //         setimgURL(data.imageUrl);
  //         setPublicId(data.imageUrl.split("/").pop()); // Extract Cloudinary ID
  //       }
  //     } catch (error) {
  //       console.error("Error fetching image:", error);
  //     }
  //   };

  //   fetchUserImage();
  // }, [session?.user?.email]);

  const handleImageUpload = (uploadedPublicId) => {
    setPublicId(uploadedPublicId);
    const newImageUrl = `https://res.cloudinary.com/${cloudName}/image/upload/${uploadedPublicId}`;
    setimgURL(newImageUrl);
  };

  const handlePublish = async () => {
    setErrorMessage("");

    if (!imageUrl || !session?.user?.email) {
      setErrorMessage("Please upload an image and ensure you are logged in.");
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await fetch("/api/auth/image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl, email: session.user.email }),
      });

      const data = await response.json();
      if (response.ok) {
        console.log("Image uploaded succesfully")
        window.location.reload();
      } else {
        setErrorMessage(data.message || "Failed to update profile picture.");
      }
    } catch (error) {
      setErrorMessage("An error occurred while updating the image.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!session) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded-xl shadow-2xl max-w-md w-full text-center">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Login Required</h2>
          <p className="text-gray-600 mb-6">Please sign in to upload an image.</p>
          <button 
            onClick={() => signIn()} 
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors duration-300"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white shadow-xl rounded-xl overflow-hidden">
      <div className="p-8">
      <label className="block text-gray-700 font-medium mb-2">Upload Image</label>
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
        {!publicId ? (
          <CloudinaryUploadWidget uwConfig={uwConfig} setPublicId={handleImageUpload} />
        ) : (
          <div className="relative group">
            <AdvancedImage
              className="w-full h-64 object-cover rounded-lg"
              cldImg={cld.image(publicId)}
              plugins={[responsive(), placeholder()]}
            />
            <button 
              onClick={() => setPublicId("")}
              className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            >
              <CloseIcon className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
      
      <button 
        onClick={handlePublish} 
        disabled={isSubmitting} 
        className="mt-4 w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors duration-300 disabled:bg-gray-400"
      >
        {isSubmitting ? "Uploading..." : "Upload"}
      </button>
    {/* <div className="mt-4 flex flex-col items-center">
      <p className="text-center text-gray-700">Profile Picture:</p>
      <img 
        src={imageUrl} 
        alt="Profile" 
        className="w-32 h-32 rounded-full mx-auto mt-2 border-2 border-gray-300 object-cover"
      />
    </div> */}
</div>

      </div>
    </div>
  );
};

export default userprofilepic;
