import { NextResponse } from "next/server";
import dbConnect from "@/backend/lib/mongodb";
import Post from "@/backend/Schema/PostsSchema";

// Connect to MongoDB
export async function POST(req) {
  await dbConnect();

  try {
    const { title, content, authorEmail, imageUrl } = await req.json();

    if (!title || !content || !authorEmail || !imageUrl) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const newPost = new Post({
      title,
      content,
      authorEmail,
      imageUrl, // Store image URL
    });

    await newPost.save();

    return NextResponse.json({ message: "Post created successfully", post: newPost }, { status: 201 });
  } catch (error) {
    console.error("Error uploading post:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// Fetch a post by title
export async function GET(req) {
  await dbConnect();

  try {
    const { searchParams } = new URL(req.url);
    const title = searchParams.get("title");

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const post = await Post.findOne({ title });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json({ post }, { status: 200 });
  } catch (error) {
    console.error("Error fetching post:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
