import { connectToDatabase } from "@/backend/lib/mongodb";
import Post from "@/backend/Schema/PostsSchema";

export async function POST(req) {
    try {
        await connectToDatabase();
        const { title, commentId, userEmail, text } = await req.json();

        const post = await Post.findOne({ title });
        if (!post) {
            return Response.json({ error: "Post not found" }, { status: 404 });
        }

        const comment = post.comments.id(commentId);
        if (!comment) {
            return Response.json({ error: "Comment not found" }, { status: 404 });
        }

        comment.replies.push({ userEmail, text });
        await post.save();

        return Response.json({ message: "Reply added", comments: post.comments });

    } catch (error) {
        console.error("Error adding reply:", error);
        return Response.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
