"use client";

import React, { useState, useEffect } from "react";
import FeaturePostsSlider from "./components/FeaturepostComp";
import TrendingPostComp from "./components/TrendingPost";
import AINews from "./components/AiNewsFetch";
import CryptoNewsFetch from "./components/CryptoNewsFetch";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const urls = [
          "/api/reaction/trending",
          "/api/categoryfetch?category=Crypto",
          "/api/categoryfetch?category=AI",
        ];

        const responses = await Promise.all(urls.map(url => fetch(url)));
        const jsonData = await Promise.all(responses.map(res => res.json()));

        setData({
          trending: jsonData[0],
          crypto: jsonData[1],
          ai: jsonData[2],
        });

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  return (
    <main className="font-sans bg-gray-50 min-h-screen">
      {/* Max width container with responsive padding */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Featured posts section - full width on mobile, can be adjusted for larger screens */}
        <section className="mb-8">
          <div className="w-full">
            <FeaturePostsSlider />
          </div>
        </section>

        {/* Trending posts section */}
        <section className="mb-8">
          <TrendingPostComp trending={data?.trending} />
        </section>

        {/* News sections with responsive layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* AI News section */}
          <section>
            <AINews aiNews={data?.ai} />
          </section>

          {/* Crypto News section */}
          <section>
            <CryptoNewsFetch cryptoNews={data?.crypto} />
          </section>
        </div>
      </div>
    </main>
  );
}