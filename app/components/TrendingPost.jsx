"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const TrendingPosts = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);

  const fetchCommentedPosts = async () => {
    try {
      setError(null);
      
      const response = await fetch('/api/reaction/trending');
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data = await response.json();
      setPosts(data);
    } catch (err) {
      setError('Failed to fetch posts: ' + err.message);
      console.error('Error fetching posts:', err);
    } 
  };

  // Load posts when component mounts
  useEffect(() => {
    fetchCommentedPosts();
  }, []);

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Function to truncate text with ellipsis
  const truncateText = (text, maxLength = 180) => {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="border-b-2 border-black pb-4 mb-8 flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Trending Posts</h1>
        <div className="text-sm opacity-70">{new Date().toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })}</div>
      </div>
      
      {/* Error message */}
      {error && (
        <div className="border-l-4 border-black bg-gray-100 p-4 mb-6 rounded">
          <div className="flex items-center">
            <svg className="w-6 h-6 mr-4 stroke-current" fill="none" strokeWidth={1.5} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
            <p className="font-medium">{error}</p>
          </div>
        </div>
      )}
      

      
      {/* Posts grid layout */}
      <div className="grid md:grid-cols-2 gap-4">
        {posts.map((post) => (
          <div 
            key={post._id} 
            className="border-b-2 border-black pb-6 group"
          >
            <Link href={`/feeds/${encodeURIComponent(post.title)}`}>
              <h2 className="text-xl font-bold mb-2 group-hover:opacity-70 transition-opacity">
                {post.title}
              </h2>
            </Link>
            
            <div className="mb-4">
              <p className="text-base leading-relaxed opacity-90">
                {truncateText(post.content)}
              </p>
            </div>
            
            <div className="flex justify-between items-center text-sm opacity-70">
              <span>{formatDate(post.createdAt)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrendingPosts;