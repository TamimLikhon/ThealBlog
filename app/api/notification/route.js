// import { NextResponse } from "next/server";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// import Notification from "@/backend/Schema/notificationSchema";
// import { connectToDatabase } from "@/backend/lib/mongodb";

// // GET Notifications for logged-in user
// export async function GET(req) {
//     try {
//         await connectToDatabase();
//         const session = await getServerSession(authOptions);
//         if (!session?.user?.email) {
//             return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
//         }

//         const notifications = await Notification.find({ receiverEmail: session.user.email }).sort({ createdAt: -1 });
//         return NextResponse.json(notifications);
//     } catch (error) {
//         console.error("Error fetching notifications:", error);
//         return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//     }
// }

// // PUT to mark notification as read
// export async function PUT(req) {
//     try {
//         await connectToDatabase();
//         const session = await getServerSession(authOptions);
//         if (!session?.user?.email) {
//             return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
//         }

//         const { notificationId } = await req.json();
//         await Notification.findByIdAndUpdate(notificationId, { read: true });
//         return NextResponse.json({ success: true });
//     } catch (error) {
//         console.error("Error updating notification:", error);
//         return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//     }
// }
