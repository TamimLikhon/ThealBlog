import { NextResponse } from "next/server";
import { connectToDatabase } from "@/backend/lib/mongodb";
import Post from "@/backend/Schema/PostsSchema";

export async function GET(req) {
    try {
        await connectToDatabase();
        
        // Extract title from query params if needed
        const { searchParams } = new URL(req.url);
        const title = searchParams.get("title");

        if (title) {
            console.log("Fetching commented post by title:", title);

            // Find post by title that has at least one comment
            const post = await Post.findOne({ 
                title: title,
                comments: { $exists: true, $ne: [] } 
            });

            if (!post) {
                return NextResponse.json({ message: "Commented post not found" }, { status: 404 });
            }

            return NextResponse.json(post, { status: 200 });
        }

        console.log("Fetching all posts with comments...");
        
        // Find all posts that have at least one comment
        const posts = await Post.find({
            comments: { $exists: true, $ne: [] }
        }).sort({ createdAt: -1 });

        return NextResponse.json(posts, { status: 200 });
    } catch (error) {
        console.error("Error fetching commented post(s):", error);
        return NextResponse.json({ message: "Failed to fetch commented posts" }, { status: 500 });
    }
}