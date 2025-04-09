"use client";
import React, { useState } from "react";
import { Cloudinary } from "@cloudinary/url-gen";
import { useSession, signIn } from "next-auth/react";
import { AdvancedImage, responsive, placeholder } from "@cloudinary/react";
import {
  Upload as UploadIcon,
  X as CloseIcon,
  Check as CheckIcon,
  AlertCircle as AlertIcon,
} from "lucide-react";

import CloudinaryUploadWidget from "@/app/components/CloudinaryUploadWidget";
import TiptapEditor from "../components/Tiptap";

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
  const [category, setCategory] = useState("");
  const [metadata, setMetadata] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const loading = status === "loading";
  const categories = [
    { value: "technology", label: "Technology" },
    { value: "science", label: "Science" },
    { value: "crypto", label: "Crypto" },
    { value: "ai", label: "AI" },
  ];

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
    // Reset previous error
    setErrorMessage("");

    // Validation
    if (!title) {
      setErrorMessage("Please enter a title.");
      return;
    }
    if (!content) {
      setErrorMessage("Please add some content to your post.");
      return;
    }
    if (!imageUrl) {
      setErrorMessage("Please upload an image.");
      return;
    }
    if (!category) {
      setErrorMessage("Please select a category.");
      return;
    }
    if (!metadata) {
      setErrorMessage("Please add metadata for SEO.");
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
          category,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        // Reset form
        setTitle("");
        setContent("");
        setPublicId("");
        setimgURL("");
        setIsUploaded(false);
        alert("Post published successfully!");
      } else {
        setErrorMessage(data.error || "Failed to publish post");
      }
    } catch (error) {
      setErrorMessage("An error occurred while publishing your post.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-48"></div>

      {!session ? (
        <div className="flex flex-col justify-center items-center text-center p-10 bg-white rounded-lg shadow-xl max-w-md mx-auto -mt-24">
          <p className="text-black mb-6">Please sign in to create a new post.</p>
          <button
            onClick={() => signIn()}
            className="bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded-md font-semibold text-white transition duration-200 w-full flex justify-center items-center"
          >
            Sign In
          </button>
        </div>
      ) : (
        <div className="max-w-2xl mx-auto bg-white shadow-xl rounded-xl overflow-hidden">
          <div className="p-8">
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
              Create New Post
            </h1>

            {/* Title Input */}
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">
                Title
              </label>
              <input
                type="text"
                placeholder="Enter an engaging title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
              />
            </div>

            {/* Metadata Input */}
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">
                SEO Metadata
              </label>
              <input
                type="text"
                placeholder="Add SEO-friendly metadata"
                value={metadata}
                onChange={(e) => setMetadata(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
              />
            </div>

            {/* Image Upload */}
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">
                Cover Image
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                {!publicId ? (
                  <div className="flex flex-col items-center">
                    <CloudinaryUploadWidget
                      uwConfig={uwConfig}
                      setPublicId={handleImageUpload}
                    />
                  </div>
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
            </div>

            {/* Category Selector */}
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">
                Category
              </label>
              <div className="grid grid-cols-3 gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => setCategory(cat.value)}
                    className={`py-2 px-4 rounded-lg transition-all duration-300 ${
                      category === cat.value
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Rich Text Editor */}
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">
                Content
              </label>
              <TiptapEditor content={content} setContent={setContent} />
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
                <AlertIcon className="mr-2 h-5 w-5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Publish Button */}
            <button
              onClick={handlePublish}
              disabled={isSubmitting}
              className={`w-full py-3 rounded-lg text-white font-semibold flex items-center justify-center transition-all duration-300 ${
                isSubmitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 hover:-translate-y-1 hover:shadow-lg"
              }`}
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Publishing...
                </>
              ) : (
                <>
                  <UploadIcon className="mr-2 h-5 w-5" />
                  Publish Post
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Upload;
