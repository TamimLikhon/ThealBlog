"use client";
import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
export default function FeaturePostsSlider() {
    const [posts, setPosts] = useState({ AI: [], Science: [], Crypto: [] });
    const [error, setError] = useState(null);
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const fetchMultipleCategories = async () => {
            try {
                const categories = ["AI", "Science", "Crypto"];
                
                // Fetch all categories in parallel
                const responses = await Promise.all(
                    categories.map(category =>
                        fetch(`/api/categoryfetch?category=${category}`).then(res => res.json())
                    )
                );
                // Store fetched data in state
                setPosts({
                    AI: responses[0],
                    Science: responses[1],
                    Crypto: responses[2],
                });
            } catch (err) {
                setError("Failed to fetch posts.");
            } 
        };
        fetchMultipleCategories();
    }, []);

    // Combine posts from all categories
    const allPosts = [
        ...(posts.AI[0] ? [{ ...posts.AI[0], category: 'AI' }] : []),
        ...(posts.Science[0] ? [{ ...posts.Science[0], category: 'Science' }] : []),
        ...(posts.Crypto[0] ? [{ ...posts.Crypto[0], category: 'Crypto' }] : [])
    ];

    // Automatic sliding
    useEffect(() => {
        const slideInterval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % allPosts.length);
        }, 5000); // Change slide every 5 seconds

        return () => clearInterval(slideInterval);
    }, [allPosts.length]);

    // Manual navigation
    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % allPosts.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + allPosts.length) % allPosts.length);
    };

    if (error) return <p className="text-center text-red-500 text-lg">Error: {error}</p>;
    if (allPosts.length === 0) return <p className="text-center text-gray-600">No posts available.</p>;

    return (
        <div className="relative w-full max-w-7xl mx-auto mt-5">
                  <h1 className="text-3xl font-bold text-left text-gray-800">Feature Posts</h1>
            <div className="relative h-[500px] overflow-hidden rounded-lg shadow-lg">
                {allPosts.map((post, index) => (
                    <div 
                        key={post._id} 
                        className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                            index === currentSlide ? 'opacity-100' : 'opacity-0'
                        }`}
                    >
                        {/* Slide Content */}
                        <div className="flex h-full w-full">
                            {/* Image Section */}
                            <div className="w-1/2 h-full relative">
    <Image
        src={post.imageUrl}
        alt={post.title}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className="object-cover"
        priority={true}
        quality={90}
    />
</div>
                            
                            {/* Content Section */}
                            <div className="w-1/2 bg-white p-8 flex flex-col justify-center">
                                <span className="text-sm uppercase tracking-wide text-blue-600 mb-2">
                                    {post.category} Category
                                </span>
                                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                                <Link href={`/feeds/${encodeURIComponent(post.title)}`} className="hover:underline text-black">
                                    {post.title}
                                </Link>
                                </h2>
                                
                                {/* Metadata */}
                                <div className="text-gray-600 mb-4 flex items-center space-x-4">
                                    {post.author && (
                                        <span className="flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                            </svg>
                                            {post.author}
                                        </span>
                                    )}
                                    {post.date && (
                                        <span className="flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                            </svg>
                                            {new Date(post.date).toLocaleDateString()}
                                        </span>
                                    )}
                                </div>
                                
                                <p className="text-lg text-gray-700 line-clamp-3">{post.content}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Navigation Dots */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {allPosts.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`h-3 w-3 rounded-full ${
                            index === currentSlide ? 'bg-blue-600' : 'bg-gray-300'
                        }`}
                    />
                ))}
            </div>

            {/* Navigation Arrows */}
            <button 
                onClick={prevSlide} 
                className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/50 rounded-full p-2 hover:bg-white/75 transition"
            >
                <ChevronLeft className="text-gray-800" />
            </button>
            <button 
                onClick={nextSlide} 
                className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/50 rounded-full p-2 hover:bg-white/75 transition"
            >
                <ChevronRight className="text-gray-800" />
            </button>
        </div>
    );
}