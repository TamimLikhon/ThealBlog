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
                
                const responses = await Promise.all(
                    categories.map(category =>
                        fetch(`/api/categoryfetch?category=${category}`).then(res => res.json())
                    )
                );
                
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

    const allPosts = [
        ...(posts.AI[0] ? [{ ...posts.AI[0], category: 'AI' }] : []),
        ...(posts.Science[0] ? [{ ...posts.Science[0], category: 'Science' }] : []),
        ...(posts.Crypto[0] ? [{ ...posts.Crypto[0], category: 'Crypto' }] : [])
    ];

    useEffect(() => {
        const slideInterval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % allPosts.length);
        }, 5000);

        return () => clearInterval(slideInterval);
    }, [allPosts.length]);

    if (error) return <p className="text-center text-red-500 text-lg">Error: {error}</p>;
    if (allPosts.length === 0) return <p className="text-center text-gray-600">No posts available.</p>;

    return (
        <div className="container mx-auto px-2 py-2 max-w-7xl relative">
            <h1 className="text-2xl font-bold border-b-2 border-black pb-4 mb-8">Breaking News</h1>
            
            <div className="relative h-[550px] border-2 border-black rounded-lg overflow-hidden">
                {allPosts.map((post, index) => (
                    <div 
                        key={post._id} 
                        className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                            index === currentSlide ? 'opacity-100' : 'opacity-0'
                        }`}
                    >
                        <div className="relative h-full">
                            <Image
                                src={post.imageUrl}
                                alt={post.title}
                                fill
                                className="absolute inset-0 w-full h-full object-cover rounded-lg"
                                priority={index === currentSlide}
                                quality={90}
                            />
                            
                            {/* Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
                            
                            {/* Text Content */}
                            <div className="absolute bottom-0 left-0 p-6 text-white">
                                <span className="text-sm uppercase tracking-wider font-semibold opacity-90">
                                    {post.category}
                                </span>
                                <h2 className="text-2xl font-bold leading-tight mt-2">
                                    <Link 
                                        href={`/feeds/${encodeURIComponent(post.title)}`} 
                                        className="hover:opacity-80 transition-opacity"
                                    >
                                        {post.title}
                                    </Link>
                                </h2>
                                <div className="flex items-center space-x-4 mt-2 text-sm opacity-80">
                                    {post.author && <span>{post.author}</span>}
                                    {post.date && <span>{new Date(post.date).toLocaleDateString()}</span>}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Navigation Dots */}
            <div className="flex justify-center space-x-2 mt-4">
                {allPosts.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`h-2 w-2 rounded-full transition-all ${
                            index === currentSlide ? 'bg-black w-6' : 'bg-gray-300'
                        }`}
                    />
                ))}
            </div>

            {/* Navigation Arrows */}
            <button 
                onClick={() => setCurrentSlide((prev) => (prev - 1 + allPosts.length) % allPosts.length)}
                className="absolute top-1/2 left-8 transform -translate-y-1/2 bg-white/50 rounded-full p-2 hover:bg-white/75 transition z-10 shadow-lg"
            >
                <ChevronLeft className="text-black" size={24} />
            </button>
            <button 
                onClick={() => setCurrentSlide((prev) => (prev + 1) % allPosts.length)}
                className="absolute top-1/2 right-8 transform -translate-y-1/2 bg-white/50 rounded-full p-2 hover:bg-white/75 transition z-10 shadow-lg"
            >
                <ChevronRight className="text-black" size={24} />
            </button>
        </div>
    );
}