import mongoose from "mongoose";

const userImagesSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    imageUrl: { type: String, required: true }, // Store Cloudinary image URL
  },
  { timestamps: true } // Automatically handles createdAt and updatedAt
);

// Create a new collection "userImages"
const UserImages = mongoose.models.UserImages || mongoose.model("UserImages", userImagesSchema);

export default UserImages;
