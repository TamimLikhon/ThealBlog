import { NextResponse } from "next/server";
import { connectToDatabase } from "@/backend/lib/mongodb";
import Post from "@/backend/Schema/PostsSchema";

export async function GET(req) {
    try {
        await connectToDatabase();
        
        // Extract title from query params
        const { searchParams } = new URL(req.url);
        const title = searchParams.get("title");

        if (title) {
            console.log("Fetching post by title:", title);

            const post = await Post.findOne({ title });

            if (!post) {
                return NextResponse.json({ message: "Post not found" }, { status: 404 });
            }

            return NextResponse.json(post, { status: 200 });
        }

        console.log("Fetching all posts...");
        const posts = await Post.find().sort({ createdAt: -1 });

        return NextResponse.json(posts, { status: 200 });
    } catch (error) {
        console.error("Error fetching post(s):", error);
        return NextResponse.json({ message: "Failed to fetch posts" }, { status: 500 });
    }
}
