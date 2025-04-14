import { connectToDatabase } from "@/backend/lib/mongodb";  
import Visitor from "@/backend/Schema/VisitorSchema";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectToDatabase();

    const rawText = await req.text(); // read raw body first
    console.log("RAW BODY TEXT:", rawText); // check what's actually coming

    const body = JSON.parse(rawText); // parse it manually

    const { title, authorEmail, sessionId, userAgent, duration } = body;

    if (!title || !authorEmail || !sessionId || !userAgent || duration == null) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const visitorEntry = new Visitor({
      title,
      authorEmail,
      sessionId,
      userAgent,
      duration,
    });

    await visitorEntry.save();

    return NextResponse.json({ message: "Visitor tracked successfully" }, { status: 201 });
  } catch (error) {
    console.error("Error in visitor tracking API:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
