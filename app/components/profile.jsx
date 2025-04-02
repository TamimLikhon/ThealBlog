"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { LogOut, User, UserCircle } from "lucide-react"; 
import Image from "next/image";

export default function Profile() {
    const { data: session } = useSession();
    const [userImage, setImgURL] = useState("");
    const [isHovering, setIsHovering] = useState(false);
    const timeoutRef = useRef(null);

    useEffect(() => {
        if (!session?.user?.email) return;

        const fetchUserImage = async () => {
            try {
                const res = await fetch(`/api/auth/image?email=${session.user.email}`);
                const data = await res.json();
                setImgURL(data);
            } catch (error) {
                console.error("Error fetching image:", error);
            }
        };

        fetchUserImage();
    }, [session?.user?.email]);

    const handleMouseEnter = () => {
        clearTimeout(timeoutRef.current);
        setIsHovering(true);
    };

    const handleMouseLeave = () => {
        timeoutRef.current = setTimeout(() => {
            setIsHovering(false);
        }, 300); // Small delay for better UX
    };

    return (
        <div className="relative">
            {session ? (
                <div 
                    className="relative"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    <div className="cursor-pointer transition duration-300 hover:opacity-90">
                        {userImage?.imageUrl ? (
                            <div className="relative h-10 w-10 overflow-hidden rounded-full ring-2 ring-gray-200 shadow-md">
                                <Image
                                    src={userImage.imageUrl}
                                    alt="User profile"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        ) : (
                            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center shadow-md">
                                <UserCircle size={24} className="text-gray-500" />
                            </div>
                        )}
                    </div>

                    {isHovering && (
                        <div 
                            className="absolute top-full right-0 mt-2 w-64 bg-white shadow-xl rounded-lg p-4 border border-gray-100 z-50 transition-all duration-200 transform origin-top-right"
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                        >
                            <div className="space-y-3">
                                <div>
                                    <p className="text-xs text-gray-500">Signed in as</p>
                                    <p className="text-sm font-medium text-gray-800 truncate">{session.user?.email}</p>
                                </div>
                                
                                <div className="h-px bg-gray-200" />
                                
                                <Link 
                                    href="/userProfile" 
                                    className="flex items-center gap-2 text-gray-700 hover:bg-gray-50 px-3 py-2 rounded-md transition duration-150 group"
                                >
                                    <User size={16} className="text-gray-500 group-hover:text-blue-500" /> 
                                    <p className="group-hover:text-blue-600 text-sm">Your Profile</p>
                                </Link>

                                <button 
                                    className="flex items-center gap-2 text-gray-700 hover:bg-gray-50 px-3 py-2 rounded-md transition duration-150 w-full text-left group"
                                    onClick={() => signOut()}
                                >
                                    <LogOut size={16} className="text-gray-500 group-hover:text-red-500" /> 
                                    <p className="group-hover:text-red-600 text-sm">Sign out</p>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <Link 
                    href="/auth/login" 
                    className="flex items-center px-4 py-2 text-gray-700 hover:text-blue-600 transition duration-150"
                >
                    <UserCircle size={20} className="mr-2" />
                    Sign In
                </Link>
            )}
        </div>
    );
}