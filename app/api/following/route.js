import { connectToDatabase } from "@/backend/lib/mongodb";
import User from "@/backend/Schema/userSchema";
import { getToken } from "next-auth/jwt";

export async function GET(req) {
    try {
        await connectToDatabase();
        const token = await getToken({ req });

        if (!token) {
            return Response.json({ error: "Not authenticated" }, { status: 401 });
        }

        const user = await User.findOne({ email: token.email }).select("following");
        if (!user) {
            return Response.json({ error: "User not found" }, { status: 404 });
        }

        return Response.json({ following: user.following });
    } catch (error) {
        console.error("Error fetching following list:", error);
        return Response.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
