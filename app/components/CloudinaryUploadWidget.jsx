"use client";
import { useEffect, useState } from "react";
import { ImageUp } from 'lucide-react';

const CloudinaryUploadWidget = ({ uwConfig, setPublicId }) => {
  const [uploadWidget, setUploadWidget] = useState(null);
  const [cloudinaryReady, setCloudinaryReady] = useState(false);

  useEffect(() => {
    // Load Cloudinary script if not available
    if (!window.cloudinary) {
      const script = document.createElement("script");
      script.src = "https://upload-widget.cloudinary.com/global/all.js";
      script.async = true;
      script.onload = () => setCloudinaryReady(true);
      document.body.appendChild(script);
    } else {
      setCloudinaryReady(true);
    }
  }, []);

  useEffect(() => {
    if (!cloudinaryReady) return;

    // Initialize Cloudinary Upload Widget
    const widget = window.cloudinary.createUploadWidget(uwConfig, (error, result) => {
      if (!error && result && result.event === "success") {
        console.log("Upload successful:", result.info);
        setPublicId(result.info.public_id);
      }
    });

    setUploadWidget(widget);
  }, [cloudinaryReady, uwConfig, setPublicId]);

  return (
<div className="flex justify-center items-center min-h-[200px]">
  <button
    onClick={() => uploadWidget && uploadWidget.open()}
    className="flex flex-col items-center justify-center gap-2 rounded-xl border border-blue-300 bg-gradient-to-b from-blue-50 to-blue-100 p-4 shadow-md transition-all hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
  >
    <ImageUp size={60} className="text-blue-400" />
    <span className="text-sm font-medium text-blue-700">Upload Image</span>
  </button>
</div>


  );
};

export default CloudinaryUploadWidget;