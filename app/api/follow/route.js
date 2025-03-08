import { connectToDatabase } from "@/backend/lib/mongodb";
import User from "@/backend/Schema/userSchema";
import { getToken } from "next-auth/jwt";

export async function POST(req) {
    try {
        await connectToDatabase();

        const token = await getToken({ req });
        if (!token) {
            return Response.json({ error: "Not authenticated" }, { status: 401 });
        }

        const { authorEmail } = await req.json();
        const userEmail = token.email;

        if (userEmail === authorEmail) {
            return Response.json({ error: "You cannot follow yourself." }, { status: 400 });
        }

        const user = await User.findOne({ email: userEmail });
        const author = await User.findOne({ email: authorEmail });

        if (!user) {
            return Response.json({ error: "User not found" }, { status: 404 });
        }
        if (!author) {
            return Response.json({ error: "Author not found" }, { status: 404 });
        }

        // Ensure `following` and `followers` exist
        if (!Array.isArray(user.following)) {
            user.following = [];
        }
        if (!Array.isArray(author.followers)) {
            author.followers = [];
        }

        const isFollowing = user.following.includes(authorEmail);

        if (isFollowing) {
            await User.updateOne({ email: userEmail }, { $pull: { following: authorEmail } });
            await User.updateOne({ email: authorEmail }, { $pull: { followers: userEmail } });
            return Response.json({ message: "Unfollowed successfully" });
        } else {
            await User.updateOne({ email: userEmail }, { $addToSet: { following: authorEmail } });
            await User.updateOne({ email: authorEmail }, { $addToSet: { followers: userEmail } });
            return Response.json({ message: "Followed successfully" });
        }
    } catch (error) {
        console.error("Follow error:", error);
        return Response.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
