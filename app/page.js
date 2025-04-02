"use client";

import React, { useState, useEffect } from "react";
import FeaturePostsSlider from "./components/FeaturepostComp";
import TrendingPostComp from "./components/TrendingPost";
import AINews from "./components/AiNewsFetch";
import CryptoNewsFetch from "./components/CryptoNewsFetch";

export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
        <div className="flex items-center justify-center h-screen bg-white text-white">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
        </div>
    );
}

  return (
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FeaturePostsSlider />
        <TrendingPostComp />
      </div>
      <div className="mt-6">
        <AINews />
      </div>
      <div className="mt-6">
        <CryptoNewsFetch />
      </div>
    </div>
  );
}