import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phonenumber: { type: Number, required: true, unique: true },
    firstname: { type: String, required: true },
    lastname: { type: String, required: true }, 
    address: { type: String, required: true },
    city: { type: String, required: true },
    district: { type: String, required: true },
    zipcode: { type: Number, required: true }, 

    isVerified: { type: Boolean, default: false },
    resetPasswordToken: { type: String },
    resetPasswordExpire: { type: Date },

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true } 
);

const User = mongoose.models.Authuser || mongoose.model("Authuser", userSchema);

export default User;
