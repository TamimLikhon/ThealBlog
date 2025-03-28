import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import {connectToDatabase} from "./mongodb.js"; // Adjust path if needed
import Admin from "../Schema/AdminSchema.js"; // Adjust path if needed

// Load environment variables
dotenv.config();

const createAdminUser = async () => {
  try {
    await connectToDatabase();

    // Check if ADMIN_EMAIL and ADMIN_PASSWORD are loaded correctly
    if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
      throw new Error("Missing ADMIN_EMAIL or ADMIN_PASSWORD in environment variables");
    }

    const existingAdmin = await Admin.findOne({ email: process.env.ADMIN_EMAIL });
    if (existingAdmin) {
      console.log("Admin already exists");
      return;
    }

    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);

    const admin = new Admin({
      email: process.env.ADMIN_EMAIL,
      password: hashedPassword,
      isAdmin: true,
    });

    await admin.save();
    console.log("✅ Admin user created successfully!");
  } catch (error) {
    console.error("Error creating admin user:", error);
  } finally {
    mongoose.connection.close();
  }
};

createAdminUser();
