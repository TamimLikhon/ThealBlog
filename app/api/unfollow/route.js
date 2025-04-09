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
        if (!authorEmail) {
            return Response.json({ error: "Missing author email" }, { status: 400 });
        }

        const user = await User.findOne({ email: token.email });
        if (!user) {
            return Response.json({ error: "User not found" }, { status: 404 });
        }

        // Remove the authorEmail from the following list
        user.following = user.following.filter(email => email !== authorEmail);

        await user.save(); // Save the updated user document

        return Response.json({ following: user.following }, { status: 200 });
    } catch (error) {
        console.error("Error unfollowing user:", error);
        return Response.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
