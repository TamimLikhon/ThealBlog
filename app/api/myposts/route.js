import { NextResponse } from "next/server";
import { connectToDatabase } from "@/backend/lib/mongodb";
import Post from "@/backend/Schema/PostsSchema";

export async function GET(req) {
    try {
        await connectToDatabase();

        const { searchParams } = new URL(req.url);
        const email = searchParams.get("email"); // Get email from query param

        if (!email) {
            return NextResponse.json({ message: "Email is required" }, { status: 400 });
        }

        const posts = await Post.find({ authorEmail: email }).sort({ createdAt: -1 });

        if (posts.length === 0) {
            return NextResponse.json({ message: "No posts found for this user" }, { status: 404 });
        }

        return NextResponse.json(posts, { status: 200 });
    } catch (error) {
        console.error("Error fetching user posts:", error);
        return NextResponse.json({ message: "Failed to fetch posts" }, { status: 500 });
    }
}
