import { NextResponse } from "next/server";
import { connectToDatabase } from "@/backend/lib/mongodb"; 
import UserImages from "@/backend/Schema/userImages";

export async function POST(req) {
  try {
    await connectToDatabase();
    const { imageUrl, email } = await req.json();

    console.log("Received Data:", { imageUrl, email });

    if (!imageUrl || !email) {
      return NextResponse.json({ message: "Invalid request" }, { status: 400 });
    }

    let userImage = await UserImages.findOne({ email });

    if (userImage) {
      userImage.imageUrl = imageUrl;
      userImage.updatedAt = new Date();
    } else {
      userImage = new UserImages({ email, imageUrl });
    }

    await userImage.save();
    console.log("Updated User Image:", userImage);

    return NextResponse.json({ message: "Image uploaded successfully", userImage }, { status: 200 });

  } catch (error) {
    console.error("Update Error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// ✅ Added GET request to fetch user's image
export async function GET(req) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ message: "Email is required" }, { status: 400 });
    }

    const userImage = await UserImages.findOne({ email });

    if (!userImage) {
      return NextResponse.json({ message: "No image found for this user" }, { status: 404 });
    }

    return NextResponse.json({ imageUrl: userImage.imageUrl }, { status: 200 });

  } catch (error) {
    console.error("Fetch Error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
export async function DELETE(req) {
  try {
    await connectToDatabase();
    const { email } = await req.json();  // Remove imageUrl from the request

    console.log("Received Data:", { email });

    if (!email) {
      return NextResponse.json({ message: "Email is required" }, { status: 400 });
    }

    const userImage = await UserImages.findOne({ email });

    if (!userImage) {
      return NextResponse.json({ message: "No image found for this user" }, { status: 404 });
    }

    // Instead of updating, consider deleting the record
    await UserImages.deleteOne({ email });

    return NextResponse.json({ message: "Image deleted successfully" }, { status: 200 });

  } catch (error) {
    console.error("Delete Error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
