import { NextResponse } from "next/server";
import { connectToDatabase } from "@/backend/lib/mongodb";
import Post from "@/backend/Schema/PostsSchema";

export async function GET(req) {
    try {
        await connectToDatabase();
        
        // Extract category from query params
        const { searchParams } = new URL(req.url);
        const category = searchParams.get("category");

        if (category) {
            console.log("Fetching posts by category:", category);

            const posts = await Post.find({ category });

            return NextResponse.json(posts, { status: 200 });
        }

        console.log("Fetching all posts...");
        const posts = await Post.find().sort({ createdAt: -1 });

        return NextResponse.json(posts, { status: 200 });
    } catch (error) {
        console.error("Error fetching post(s):", error);
        return NextResponse.json({ message: "Failed to fetch posts" }, { status: 500 });
    }
}
