import { connectToDatabase } from "@/backend/lib/mongodb";
import Post from "@/backend/Schema/PostsSchema";

export async function POST(req) {
    try {
        await connectToDatabase();
        const { title, userEmail } = await req.json();

        const post = await Post.findOne({ title });
        if (!post) {
            return Response.json({ error: "Post not found" }, { status: 404 });
        }

        if (post.likes.includes(userEmail)) {
            post.likes = post.likes.filter(email => email !== userEmail);
        } else {
            post.likes.push(userEmail);
        }

        await post.save();
        return Response.json({ message: "Like updated", likes: post.likes.length });

    } catch (error) {
        console.error("Error liking post:", error);
        return Response.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
