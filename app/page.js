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
      <div className="flex justify-center items-center h-screen">
        <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
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