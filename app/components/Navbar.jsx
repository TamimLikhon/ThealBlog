"use client";
import Link from "next/link";
import { useState } from "react";
import Profile from "./profile";
import SearchComp from "./search";
import { Menu, X } from "lucide-react";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="relative bg-black dark:bg-gray-900 font-bold text-white p-4 flex items-center justify-between shadow-md transition-colors duration-300">
            
            {/* Left Section - Brand */}
            <div className="text-xl px-4">ThealBlog</div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex flex-grow justify-center space-x-6">
                <Link href="/" className="hover:text-gray-300 transition">Home</Link>
                <Link href="/userProfile" className="hover:text-gray-300 transition">Profile</Link>
                <Link href="/createpost" className="hover:text-gray-300 transition">Write a Blog</Link>
                <Link href="/myblog" className="hover:text-gray-300 transition">My Blog</Link>
                <Link href="/feeds" className="hover:text-gray-300 transition">Feeds</Link>
                <Link href="/following-feeds" className="hover:text-gray-300 transition">Custom Feed</Link>
            </div>

            {/* Right Section - Profile & Search */}
            <div className="hidden md:flex items-center space-x-4">

                <SearchComp />
                <Profile />
            </div>

            {/* Mobile Menu Button */}
            <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-white focus:outline-none">
                {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Mobile Dropdown Menu */}
            {isOpen && (
                <div className="absolute top-16 left-0 w-full bg-black dark:bg-gray-900 text-white p-4 flex flex-col items-center space-y-4 md:hidden">
                    <Link href="/" className="hover:text-gray-300 transition" onClick={() => setIsOpen(false)}>Home</Link>
                    <Link href="/userProfile" className="hover:text-gray-300 transition" onClick={() => setIsOpen(false)}>Profile</Link>
                    <Link href="/createpost" className="hover:text-gray-300 transition" onClick={() => setIsOpen(false)}>Write a Blog</Link>
                    <Link href="/myblog" className="hover:text-gray-300 transition" onClick={() => setIsOpen(false)}>My Blog</Link>
                    <Link href="/feeds" className="hover:text-gray-300 transition" onClick={() => setIsOpen(false)}>Feeds</Link>
                    <Link href="/following-feeds" className="hover:text-gray-300 transition" onClick={() => setIsOpen(false)}>Custom Feed</Link>

                    {/* Profile & Search in Mobile View */}
                    <div className="flex flex-col items-center space-y-4">
                        <SearchComp />
                        <Profile />
                    </div>
                </div>
            )}
        </nav>
    );
}
