"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import Profile from "./profile";
import SearchComp from "./search";
import { Menu, X } from "lucide-react";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    
    // Close mobile menu when screen size changes to desktop
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768 && isOpen) {
                setIsOpen(false);
            }
        };
        
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [isOpen]);
    
    // Prevent scrolling when mobile menu is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
        
        return () => {
            document.body.style.overflow = "auto";
        };
    }, [isOpen]);

    return (
        <nav className="font-sans sticky top-0 z-50 bg-black dark:bg-gray-900 font-bold text-white shadow-md transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <Link href="/" className="text-xl font-bold hover:text-blue-500 transition">
                            ThealBlog
                        </Link>
                    </div>
                    
                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center justify-center flex-grow">
                        <div className="flex space-x-4">
                            <Link href="/" className="px-3 py-2  hover:text-blue-500 transition">Home</Link>
                            <Link href="/userProfile" className="px-3 py-2 hover:text-blue-500 transition">Profile</Link>
                            <Link href="/createpost" className="px-3 py-2 hover:text-blue-500 transition">Write a Blog</Link>
                            <Link href="/feeds" className="px-3 py-2 hover:text-blue-500 transition">Feed</Link>
                            <Link href="/following-feeds" className="px-3 py-2 hover:text-blue-500 transition">Vibe</Link>
                        </div>
                    </div>
                    
                    {/* Desktop Search and Profile */}
                    <div className="hidden md:flex items-center space-x-4">
                        <SearchComp />
                        <Profile />
                    </div>
                    
                    {/* Mobile Search and Menu Button */}
                    <div className="md:hidden flex items-center space-x-2">
                        <div className="scale-90">
                            <SearchComp />
                        </div>
                        <button 
                            onClick={() => setIsOpen(!isOpen)} 
                            className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-blue-500 focus:outline-none"
                            aria-expanded={isOpen}
                        >
                            <span className="sr-only">{isOpen ? 'Close menu' : 'Open menu'}</span>
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isOpen && (
                <div className="md:hidden bg-black dark:bg-gray-900 shadow-lg">
                    <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3">
                        <Link 
                            href="/" 
                            className="block px-3 py-2 rounded-md text-center hover:bg-gray-800 hover:text-blue-500 transition" 
                            onClick={() => setIsOpen(false)}
                        >
                            Home
                        </Link>
                        <Link 
                            href="/userProfile" 
                            className="block px-3 py-2 rounded-md text-center hover:bg-gray-800 hover:text-blue-500 transition" 
                            onClick={() => setIsOpen(false)}
                        >
                            Profile
                        </Link>
                        <Link 
                            href="/createpost" 
                            className="block px-3 py-2 rounded-md text-center hover:bg-gray-800 hover:text-blue-500 transition" 
                            onClick={() => setIsOpen(false)}
                        >
                            Write a Blog
                        </Link>
                        <Link 
                            href="/feeds" 
                            className="block px-3 py-2 rounded-md text-center hover:bg-gray-800 hover:text-blue-500 transition" 
                            onClick={() => setIsOpen(false)}
                        >
                            Feed
                        </Link>
                        <Link 
                            href="/following-feeds" 
                            className="block px-3 py-2 rounded-md text-center hover:bg-gray-800 hover:text-blue-500 transition" 
                            onClick={() => setIsOpen(false)}
                        >
                            Vibe
                        </Link>
                    </div>
                    <div className="pt-4 pb-6 px-4 flex justify-center">
                        <Profile />
                    </div>
                </div>
            )}
        </nav>
    );
}