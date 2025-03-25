"use client";
import React, { useState, useEffect } from "react";
import AINews from "./AiNews/page";
import FeaturePostsSlider from "./components/FeaturepostComp";
import TrendingPostComp from "./components/TrendingPost";

export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000); 
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6 p-4">
      <FeaturePostsSlider />
      <div className="flex flex-wrap justify-center gap-4 w-full">
        <AINews />
        <TrendingPostComp />
      </div>
    </div>
  );
}
