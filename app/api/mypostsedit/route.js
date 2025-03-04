import { connectToDatabase } from "@/backend/lib/mongodb"; 
import Post from "@/backend/Schema/PostsSchema"; 

export async function PUT(req) {
    try {
        await connectToDatabase(); 

        const body = await req.json();
        const { email, currentTitle, newTitle, newContent } = body;

        if (!email || !currentTitle || !newTitle || !newContent) {
            return new Response(JSON.stringify({ error: "All fields are required" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        // Find post by email and current title
        const post = await Post.findOne({ authorEmail: email, title: currentTitle });

        if (!post) {
            return new Response(JSON.stringify({ error: "Post not found" }), {
                status: 404,
                headers: { "Content-Type": "application/json" },
            });
        }

        // Update title and content
        post.title = newTitle;
        post.content = newContent;
        post.updatedAt = new Date();

        await post.save();

        return new Response(JSON.stringify({ message: "Post updated successfully", post }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Error updating post:", error);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}
