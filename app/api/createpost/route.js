import { NextResponse } from "next/server";
import { connectToDatabase } from "@/backend/lib/mongodb"; 
import Post from "@/backend/Schema/PostsSchema";

export async function POST(req) {
  try {
    await connectToDatabase();
    const { title, content, authorEmail } = await req.json();

    if (!title.trim() || !content.trim()) {
      return NextResponse.json({ message: "Invalid input" }, { status: 400 });
    }

    const newPost = new Post({ title, content, authorEmail });
    await newPost.save();

    return NextResponse.json({ message: "Post published successfully" }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
