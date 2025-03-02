"use client";
import Link from "next/link";
import Profile from "./profile";

export default function Navbar() {
    return (
        <nav className="relative bg-black font-bold text-white p-4 flex items-center shadow-md">

            <div className="text-xl px-4">
                Authentication
            </div>

            {/* Navigation Links (Centered) */}
            <div className="flex-grow flex justify-center space-x-6">
                <Link href="/auth/login" className="hover:text-gray-300 transition">Login</Link>
                <Link href="/auth/signup" className="hover:text-gray-300 transition">Signup</Link>
                <Link href="/userProfile" className="hover:text-gray-300 transition">Profile</Link>
            </div>

            {/* Profile (Right - Top Corner) */}
            <div className="absolute right-20 top-3">
                <Profile />
            </div>

        </nav>
    );
}
