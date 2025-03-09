import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectToDatabase } from "@/backend/lib/mongodb";
import Post from "@/backend/Schema/PostsSchema";
import User from "@/backend/Schema/userSchema"; 

export async function GET(req) {
    try {
        await connectToDatabase();

        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
        }

        const user = await User.findOne({ email: session.user.email });
        if (!user || !user.following || user.following.length === 0) {
            return NextResponse.json([]);
        }

        const posts = await Post.find({ authorEmail: { $in: user.following } }).sort({ createdAt: -1 });

        return NextResponse.json(posts);
    } catch (error) {
        console.error("Error fetching following feeds:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
