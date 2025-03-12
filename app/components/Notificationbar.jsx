// "use client";
// import { useEffect, useState } from "react";
// import { useSession } from "next-auth/react";
// import { useRouter } from "next/navigation";

// export default function NotificationBar() {
//     const { data: session } = useSession();
//     const [notifications, setNotifications] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const router = useRouter();

//     useEffect(() => {
//         const fetchNotifications = async () => {
//             if (!session?.user?.email) return;
//             try {
//                 const response = await fetch("/api/notification");
//                 const data = await response.json();
//                 setNotifications(data);
//             } catch (error) {
//                 console.error("Error fetching notifications:", error);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchNotifications();
//     }, [session]);

//     const handleNotificationClick = async (notificationId, postTitle) => {
//         await fetch(`/api/notification/${notificationId}`, { method: "PUT" });
//         router.push(`/feeds/${postTitle}`);
//     };

//     return (
//         <div className="relative">
//             <button className="p-2 bg-blue-500 text-white rounded-full relative">
//                 Notifications ({notifications.length})
//             </button>
//             <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-lg p-4 z-50">
//                 {loading ? (
//                     <p>Loading...</p>
//                 ) : notifications.length === 0 ? (
//                     <p>No new notifications</p>
//                 ) : (
//                     notifications.map((notif) => (
//                         <div
//                             key={notif._id}
//                             className={`p-2 border-b cursor-pointer ${notif.read ? "bg-gray-200" : "bg-white"}`}
//                             onClick={() => handleNotificationClick(notif._id, notif.postTitle)}
//                         >
//                             <p className="text-sm text-gray-700">{notif.message}</p>
//                         </div>
//                     ))
//                 )}
//             </div>
//         </div>
//     );
// }
