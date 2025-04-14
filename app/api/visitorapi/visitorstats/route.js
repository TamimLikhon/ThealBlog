import { NextResponse } from "next/server";
import Visitor from "@/backend/Schema/VisitorSchema";
import { connectToDatabase } from "@/backend/lib/mongodb";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");

  await connectToDatabase();

  try {
    const visits = await Visitor.aggregate([
      {
        $match: {
          authorEmail: email,
        },
      },
      {
        $group: {
          _id: "$title",
          totalDuration: { $sum: "$duration" },
        },
      },
      {
        $project: {
          title: "$_id",
          totalDuration: { $round: ["$totalDuration", 2] }, // round to 2 decimal places
          _id: 0,
        },
      },
    ]);

    return NextResponse.json({ visits }, { status: 200 });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
