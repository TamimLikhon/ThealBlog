"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { LogOut, User, UserCircle } from "lucide-react"; // Icons for better UI

export default function Profile() {
    const { data: session } = useSession();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            {session ? (
                <div>
                    <div
                        className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold cursor-pointer transition hover:opacity-80"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {session.user?.email?.charAt(0).toUpperCase()} {/* First letter of email */}
                    </div>

                    {/* Dropdown Menu */}
                    {isOpen && (
                        <div className="absolute top-full right-0 mt-2 w-56 bg-white shadow-lg rounded-lg p-3">
                            <p className="text-xs text-gray-500 mb-2">Signed in as</p>
                            <p className="text-sm font-semibold text-gray-900 truncate">{session.user?.email}</p>
                            <hr className="my-2" />

                            <Link 
                                href="/userProfile" 
                                className="flex items-center gap-2 text-gray-700 hover:bg-gray-100 px-3 py-2 rounded transition"
                            >
                                <User size={16} /> Your Profile
                            </Link>

                            <button 
                                className="flex items-center gap-2 text-red-500 hover:bg-red-100 px-3 py-2 rounded transition w-full text-left"
                                onClick={() => signOut()}
                            >
                                <LogOut size={16} /> Sign out
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <Link href="/auth/login" className="text-white hover:text-blue-400 transition">
                    <UserCircle size={32} /> {/* Display UserCircle Icon */}
                </Link>
            )}
        </div>
    );
}
