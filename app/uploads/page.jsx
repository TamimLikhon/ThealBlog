"use client";
import React, { useState } from "react";
import { Cloudinary } from "@cloudinary/url-gen";
import { useSession, signIn } from "next-auth/react";
import { AdvancedImage, responsive, placeholder } from "@cloudinary/react";
import CloudinaryUploadWidget from "@/app/components/CloudinaryUploadWidget";

import CategorySelector from "../components/CatgeoryComp";

const Upload = () => {
  const cloudName = "drpertfp7";
  const uploadPreset = "uploadImages";
  const { data: session, status } = useSession();
  const [publicId, setPublicId] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setimgURL] = useState("");
  const [isUploaded, setIsUploaded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [category, setCategory] = useState(""); // Default category
  const [metadata, setMetadata] = useState("");

  const cld = new Cloudinary({
    cloud: {
      cloudName,
    },
  });

  const uwConfig = {
    cloudName,
    uploadPreset,
  };

  const handleImageUpload = (uploadedPublicId) => {
    setPublicId(uploadedPublicId);
    const imageUrl = `https://res.cloudinary.com/${cloudName}/image/upload/${uploadedPublicId}`;
    setimgURL(imageUrl);
    setIsUploaded(true);
  };

  const handlePublish = async () => {
    if (!title || !content || !imageUrl || !metadata || !category) {
      alert("Please fill in all fields and upload an image before publishing.");
      return;
    }
    
    try {
      setIsSubmitting(true);
      const response = await fetch("/api/createpost", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          content,
          authorEmail: session?.user?.email,
          imageUrl,
          metadata,
          category
        }),
      });
      
      const data = await response.json();
      if (response.ok) {
        alert("Post published successfully!");
        setTitle("");
        setContent("");
        setPublicId("");
        setimgURL("");
        setIsUploaded(false);
      } else {
        console.error("Failed to upload post:", data.error);
        alert(`Failed to publish: ${data.error}`);
      }
    } catch (error) {
      console.error("Error uploading post:", error);
      alert("An error occurred while publishing your post.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        {!session ? (
          <div className="fixed inset-0 flex flex-col justify-center items-center bg-gray-900 bg-opacity-80 backdrop-blur-sm text-white z-50">
            <div className="bg-gray-800 p-8 rounded-lg shadow-2xl max-w-md w-full text-center">
              <h1 className="text-3xl font-bold mb-4">Oops! You're not logged in</h1>
              <p className="mb-6 text-gray-300">Please sign in to create a post.</p>
              <button 
                onClick={() => signIn()} 
                className="bg-blue-600 hover:bg-blue-700 transition-colors duration-300 px-6 py-3 rounded-lg font-semibold text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                Sign In
              </button>
            </div>
          </div>
        ) : (
          <div className="p-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Create a New Post</h1>
            
            <div className="space-y-6">
              <div className="transition-all duration-300 focus-within:ring-2 focus-within:ring-blue-500 rounded-lg overflow-hidden">
                <input
                  type="text"
                  placeholder="Enter an engaging title..."
                  className="border-0 border-b border-gray-200 p-4 w-full text-xl font-medium focus:outline-none focus:ring-0 bg-gray-50"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <input type="text" placeholder="Enter SEO friendly metadata" 
        onChange={(e) => setMetadata(e.target.value)} 
      />
              
              <div className="bg-gray-50 rounded-lg p-6 border border-dashed border-gray-300 flex flex-col items-center justify-center">
                {!publicId ? (
                  <div className="text-center">
                    <CloudinaryUploadWidget uwConfig={uwConfig} setPublicId={handleImageUpload} />
                  </div>
                ) : (
                  <div className="w-full relative group">
                    <AdvancedImage
                      className="w-full h-64 object-cover rounded-lg shadow-md"
                      cldImg={cld.image(publicId)}
                      plugins={[responsive(), placeholder()]}
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <button 
                        onClick={() => setPublicId("")} 
                        className="bg-red-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-red-700 transition-colors duration-300">
                        Replace Image
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <CategorySelector selectedCategory={category} onChange={setCategory} />

              
              <div className="transition-all duration-300 focus-within:ring-2 focus-within:ring-blue-500 rounded-lg overflow-hidden">
                <textarea
                  placeholder="Write your post content here..."
                  className="border-0 p-4 w-full h-64 focus:outline-none focus:ring-0 bg-gray-50 resize-none"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </div>
              
              <div className="flex justify-between items-center pt-4">
                <div className="text-sm text-gray-500">
                  {!title && !content && !publicId ? (
                    "All fields are required"
                  ) : (
                    <>
                      {!title && <span className="text-red-500">• Title required</span>}
                      {!content && <span className="text-red-500 ml-2">• Content required</span>}
                      {!publicId && <span className="text-red-500 ml-2">• Image required</span>}
                    </>
                  )}
                </div>
                
                <button
                  onClick={handlePublish}
                  disabled={!isUploaded || !title || !content || isSubmitting}
                  className={`px-8 py-3 rounded-lg font-semibold text-white shadow-md transition-all duration-300 ${
                    isUploaded && title && content && !isSubmitting
                      ? "bg-emerald-600 hover:bg-emerald-700 transform hover:-translate-y-0.5"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}>
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Publishing...
                    </span>
                  ) : (
                    "Publish Post"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Upload;