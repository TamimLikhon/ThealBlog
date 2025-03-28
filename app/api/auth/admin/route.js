import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { connectToDatabase } from "@/backend/lib/mongodb";
import User from "@/backend/Schema/userSchema";

const SECRET_KEY = process.env.RANDOM_SECRET_KEY;

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    // 1️⃣ Connect to MongoDB
    await connectToDatabase();

    // 2️⃣ Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return Response.json({ message: "User not found" }, { status: 401 });
    }

    // 3️⃣ Compare plain password with hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return Response.json({ message: "Invalid credentials" }, { status: 401 });
    }

    // 4️⃣ Generate JWT Token
    const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, SECRET_KEY, {
      expiresIn: "1h",
    });

    return Response.json({ token }, { status: 200 });
  } catch (error) {
    console.error("Login Error:", error);
    return Response.json({ message: "Server error" }, { status: 500 });
  }
}
