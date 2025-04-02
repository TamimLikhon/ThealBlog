import { connectToDatabase } from "@/backend/lib/mongodb"; // Ensure correct path to your DB connection
import User from "@/backend/Schema/userSchema"; // Ensure this is the correct path
import bcrypt from "bcrypt";

export async function POST(req) {
    try {
        await connectToDatabase(); // Connect to MongoDB

        const { email, password, phonenumber, firstname, lastname, address, city, district, zipcode, imageUrl } = await req.json();

        if (!email || !password || !phonenumber || !firstname || !lastname || !address || !city || !district || !zipcode || !imageUrl) {
            return new Response(JSON.stringify({ error: "All Fields are required" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return new Response(JSON.stringify({ error: "User already exists" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const newUser = new User({ email, password: hashedPassword, phonenumber, firstname, lastname, address, city, district, zipcode, imageUrl });
        await newUser.save();

        return new Response(JSON.stringify({ message: "User registered successfully" }), {
            status: 201,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Error in register route:", error);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}
