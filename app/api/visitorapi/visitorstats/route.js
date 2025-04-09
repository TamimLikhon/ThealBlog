import { connectToDatabase } from "@/backend/lib/mongodb";
import Visitor from "@/backend/Schema/VisitorSchema";
import { NextResponse } from "next/server";
export async function GET(req) {
  try {
    await connectToDatabase();
    const visitors = await Visitor.find();

    const urlTimeMap = {};
    
    visitors.forEach(visitor => {
      visitor.urls.forEach(entry => {
        const rawUrl = entry.url || "";
        const decodedUrl = decodeURIComponent(rawUrl);
    
        const start = new Date(entry.startTimestamp).getTime();
        const end = new Date(entry.endTimestamp).getTime();
        const visitTimespan = Math.max(end - start, 0);  // ms
    
        if (!urlTimeMap[decodedUrl]) {
          urlTimeMap[decodedUrl] = 0;
        }
    
        urlTimeMap[decodedUrl] += visitTimespan;
      });
    });
    const formattedStats = Object.entries(urlTimeMap).map(([url, duration]) => ({
      url,
      duration: `${(duration / 1000).toFixed(2)} seconds`,
    }));
    formattedStats.sort((a, b) => b.duration - a.duration);
    console.log("Visitor Data:", formattedStats);    

    return NextResponse.json(formattedStats);
  } catch (error) {
    console.error("Visitor Data error:", error);
    return new NextResponse(
      JSON.stringify({ error: "Internal Server Error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

