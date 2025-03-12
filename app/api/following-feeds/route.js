import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { connectToDatabase } from "@/backend/lib/mongodb";
import Post from "@/backend/Schema/PostsSchema";
import User from "@/backend/Schema/userSchema"; 

export async function GET(req) {
    try {
        await connectToDatabase();
        const token = await getToken({ req });

        if (!token?.email) {
            return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
        }

        const user = await User.findOne({ email: token.email });
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