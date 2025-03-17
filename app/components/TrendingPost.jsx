import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {MessageCircle, Calendar, User, ChevronRight } from 'lucide-react';

const TrendingPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCommentedPosts = async () => {
    try {
      setLoading(true);
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
    } finally {
      setLoading(false);
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
  const truncateText = (text, maxLength = 150) => {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header with trending icon */}
      <div className="flex items-center mb-8 bg-gradient-to-r from-purple-600 to-blue-500 text-white p-4 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold">Trending Posts</h1>
      </div>
      
      {/* Error message */}
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded mb-6 shadow">
          <div className="flex">
            <div className="py-1">
              <svg className="w-6 h-6 mr-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
              </svg>
            </div>
            <div>{error}</div>
          </div>
        </div>
      )}
      
      {/* Loading state with animation */}
      {loading && (
        <div className="flex justify-center items-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <p className="ml-3 text-lg text-gray-600">Loading trending posts...</p>
        </div>
      )}
      
      {/* No posts found */}
      {!loading && posts.length === 0 && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-lg shadow text-center">
          <p className="text-lg text-gray-700">No trending posts found with your search criteria.</p>
          <button 
            onClick={fetchCommentedPosts}
            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            View all trending posts
          </button>
        </div>
      )}
      
      {/* Posts grid layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {posts.map((post) => (
          <div key={post._id} className="bg-white rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl hover:translate-y-1 border border-gray-200">
            {/* Card header with gradient */}
            <div className="bg-gradient-to-r from-blue-100 to-purple-100 px-6 py-4">
              <Link href={`/feeds/${encodeURIComponent(post.title)}`} className="group">
                <h2 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors flex items-center">
                  {post.title}
                  <ChevronRight className="w-5 h-5 ml-2 opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-1 transition-all" />
                </h2>
              </Link>
            </div>
            
            {/* Card content */}
            <div className="px-6 py-4">
              {/* Author and date info */}
              <div className="flex items-center text-sm text-gray-600 mb-4">
                <div className="flex items-center mr-4">
                  <User className="w-4 h-4 mr-1" />
                  <span>{post.authorEmail.split('@')[0]}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span>{formatDate(post.createdAt)}</span>
                </div>
              </div>
              
              {/* Content preview */}
              <div className="text-gray-700 mb-4">
                {truncateText(post.content)}
              </div>
              
              {/* Comment count badge */}
              <div className="flex justify-between items-center mt-4">
                <div className="flex items-center bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
                  <MessageCircle className="w-4 h-4 mr-1" />
                  <span className="font-medium">{post.comments.length} comments</span>
                </div>
                
                <Link 
                  href={`/feeds/${encodeURIComponent(post.title)}`}
                  className="text-blue-600 hover:text-blue-800 font-medium flex items-center transition-colors"
                >
                  Read more
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrendingPosts;