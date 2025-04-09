"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { LogOut, User, UserCircle } from "lucide-react";
import Image from "next/image";

export default function Profile() {
    const { data: session } = useSession();
    const [userImage, setImgURL] = useState("");
    const [menuOpen, setMenuOpen] = useState(false);

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

    return (
        <div className="relative  dark:bg-gray-900 px-4">
            {session ? (
                <div className="flex flex-col md:flex-row items-center gap-4 py-4 relative group">
                    {/* Profile Image */}
                    <div className="cursor-pointer transition duration-300 hover:opacity-90">
                        {userImage?.imageUrl ? (
                            <div className="relative h-12 w-12 overflow-hidden rounded-full ring-2 ring-gray-200 shadow-md">
                                <Image
                                    src={userImage.imageUrl}
                                    alt="User profile"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        ) : (
                            <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center shadow-md">
                                <UserCircle size={24} className="text-gray-500" />
                            </div>
                        )}
                    </div>
    
                    {/* Hidden content on desktop, visible on mobile */}
                    <div
                        className={`
                            flex-col md:absolute md:top-14 md:left-0 md:bg-gray-900 md:rounded-md md:shadow-lg md:p-4
                            md:opacity-0 md:invisible md:group-hover:visible md:group-hover:opacity-100
                            transition-all duration-300 ease-in-out
                            flex items-center md:items-start gap-2 
                        `}
                    >
                        <p className="text-sm text-white shadow-md shadow-amber-200">
                            {session.user?.email}
                        </p>
    
                        <div className="flex flex-col md:flex-row gap-2 mt-3 ">
                            <Link
                                href="/userProfile"
                                className="flex items-center gap-1  hover:bg-blue-400 text-black px-3 py-2 rounded-md transition duration-150 group bg-gray-800 shadow-md hover:shadow-lg"
                            >
                                <User size={16} className="text-white" />
                                <p className=" text-white text-sm">Profile</p>
                            </Link>
    
                            <button
                                className="flex items-center text-black hover:bg-red-500 px-3 py-2 rounded-md transition duration-150 group bg-gray-800 shadow-md hover:shadow-lg"
                                onClick={() => signOut()}
                            >
                                <LogOut size={16} className="text-white"/>
                                <p className="text-sm text-white">Logout</p>
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <Link
                    href="/auth/login"
                    className="flex items-center px-4 py-2 text-white "
                >
                    <UserCircle size={20} className="mr-2 " />
                    <p className="text-ms text-white hover:text-blue-600 transition duration-150">Sign in</p>
                </Link>
            )}
        </div>
    );
    
}
