"use client";
import Link from "next/link";
import Profile from "./profile";
import DarkModeToggle from "../style/DarkMode";

export default function Navbar() {
    return (
        <nav className="relative bg-black dark:bg-gray-900 font-bold text-white p-4 flex items-center shadow-md transition-colors duration-300">

            <div className="text-xl px-4">Authentication</div>

            {/* Navigation Links (Centered) */}
            <div className="flex-grow flex justify-center space-x-6">
                <Link href="/" className="hover:text-gray-300 transition">Home</Link>
                <Link href="/userProfile" className="hover:text-gray-300 transition">Profile</Link>
                <Link href="/createpost" className="hover:text-gray-300 transition"> Write a Blog</Link>
                <Link href="/myblog" className="hover:text-gray-300 transition">My Blog</Link>
                <Link href="/feeds" className="hover:text-gray-300 transition">Feeds</Link>
                <Link href="/following-feeds" className="hover:text-gray-300 transition">Custom Feed</Link>

            </div>


            {/* Profile (Right - Top Corner) */}
            <div className="absolute right-20 top-3">
                <Profile />
            </div>

        </nav>
    );
}
