import { connectToDatabase } from "@/backend/lib/mongodb";
import Visitor from "@/backend/Schema/VisitorSchema";
import { NextResponse } from "next/server";
export async function POST(req){
    try{
        await connectToDatabase();
        const body = await req.json();
        const {url, sessionId, userAgent, startTimestamp, endTimestamp} = body;
        const visitTimespan = endTimestamp - startTimestamp;
        console.log("⚡️ Visitor tracking API HIT"); // 👈 add this

        const visitorExistence = await Visitor.findOne({sessionId});
        
        if(!visitorExistence){
        const newVisitor = await Visitor.create({
            urls: [
                {
                  url,
                  startTimestamp,
                  endTimestamp,
                  visitTimespan, // -> visitTimespan = startTimestamp - endTimestamp
                }
              ],
            sessionId,
            userAgent,
        });

        await newVisitor.save();
        return NextResponse.json({ message: "New session created" }, { status: 201 });
    
        }
        else {
             visitorExistence.urls.push({
                url,
                startTimestamp,
                endTimestamp,
                visitTimespan
            });
            visitorExistence.visitTimespan += (endTimestamp - startTimestamp);            await visitorExistence.save();
            return NextResponse.json({message: "Session updated"}, { status: 200 });
        }
    } catch (error) {
        console.error("Visitor POST error:", error);
        return new NextResponse(JSON.stringify({ error: "Internal Server Error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
    
}