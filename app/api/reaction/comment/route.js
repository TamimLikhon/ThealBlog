import { connectToDatabase } from "@/backend/lib/mongodb";
import Post from "@/backend/Schema/PostsSchema";

export async function POST(req) {
    try {
        await connectToDatabase();
        const { title, userEmail, text } = await req.json();

        const post = await Post.findOne({ title });
        if (!post) {
            return Response.json({ error: "Post not found" }, { status: 404 });
        }

        post.comments.push({ userEmail, text });
        await post.save();

        return Response.json({ message: "Comment added", comments: post.comments });

    } catch (error) {
        console.error("Error adding comment:", error);
        return Response.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
