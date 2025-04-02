"use client";
import React from "react";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import Link from "next/link";
export default function UserProMyBlogSec() {
  const { data: session } = useSession();
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch(
          `/api/myposts?email=${session.user.email}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch blogs");
        }
        const data = await response.json();
        setBlogs(data);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <div className="w-full flex flex-col gap-4">
      <p className="text-xl font-bold text-black">Total Blogs: {blogs.length}</p>
      {blogs.length > 0 ? (
        blogs.map((blog) => (
          <div
            key={blog._id}
            className="bg-white shadow-md rounded-lg p-4 flex flex-col gap-2"
          >
            <Link
              href={`/myblog/${encodeURIComponent(blog.title)}`}
              className="hover:underline text-black font-semibold text-lg"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                window.scrollTo(0, 0);
              }} // copilot suggested this
            >
              {blog.title}
            </Link>
            <p>{blog.metadata}</p>
            <p className="text-gray-500 text-sm">{blog.date}</p>
          </div>
        ))
      ) : (
        <p>No blogs found</p>
      )}
    </div>
  );
}
