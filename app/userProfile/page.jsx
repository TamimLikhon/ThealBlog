"use client";
import { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import MyBlog from "../myblog/page";
import NotificationBar from "../components/Notificationbar";

function UserProfile({ session, newName, setNewName, handleUpdate, loading, message }) {
    return (
        <div className="bg-white shadow-lg rounded-lg p-6 max-w-md w-full">
            <h1 className="text-2xl font-semibold text-gray-800 mb-4">Profile</h1>
            <p className="text-gray-600 mb-2">
                <span className="font-medium text-gray-800">Current Name:</span> {session?.user?.firstname}
            </p>
            
            <div className="flex flex-col gap-4">
                <input
                    type="text"
                    placeholder="Enter new name"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    onClick={handleUpdate}
                    disabled={loading}
                    className={`w-full px-4 py-2 text-white font-semibold rounded-md transition ${
                        loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                    }`}
                >
                    {loading ? "Updating..." : "Update Name"}
                </button>
            </div>

            {message && (
                <p className={`mt-3 text-sm font-medium ${message.includes("successfully") ? "text-green-600" : "text-red-600"}`}>
                    {message}
                </p>
            )}
        </div>
    );
}

export default function Profile() {
    const { data: session, update } = useSession();
    const [newName, setNewName] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [following, setFollowing] = useState([]);

    useEffect(() => {
        if (session) {
            fetchFollowing();
        }
    }, [session]);

    const fetchFollowing = async () => {
        try {
            const response = await fetch("/api/following");
            const data = await response.json();

            if (response.ok) {
                setFollowing(data.following);
            } else {
                console.error("Error fetching following list:", data.error);
            }
        } catch (error) {
            console.error("Network error:", error);
        }
    };

    const handleUpdate = async () => {
        if (!newName.trim()) {
            setMessage("Please enter a valid name.");
            return;
        }

        setLoading(true);
        setMessage("");

        try {
            const response = await fetch("/api/auth/user", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: session?.user?.email,
                    firstname: newName,
                }),
            });

            const data = await response.json();
            if (response.ok) {
                setMessage("Firstname updated successfully!");
                update();
            } else {
                setMessage(data.error || "Failed to update name.");
            }
        } catch (error) {
            setMessage("Network error, please try again.");
            console.error("Network error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
<div className="min-h-screen bg-white">
  {/* Header with gradient accent */}
  <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-48"></div>
  
  {!session ? (
    <div className="flex flex-col justify-center items-center text-center p-10 bg-white rounded-lg shadow-xl max-w-md mx-auto -mt-24">
      <div className="bg-gray-100 p-5 rounded-full mb-6">
        <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
        </svg>
      </div>
      <h1 className="text-2xl font-bold mb-3 text-gray-800">Account Required</h1>
      <p className="mb-6 text-gray-600">Please sign in to access your personal profile and content.</p>
      <button 
        onClick={() => signIn()} 
        className="bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded-md font-semibold text-white transition duration-200 w-full flex justify-center items-center">
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
        </svg>
        Sign In
      </button>
    </div>
  ) : (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 -mt-24 pb-12">
      <div className="max-w-5xl mx-auto">
        {/* Profile Card */}
        <div className="bg-white rounded-lg shadow-xl overflow-hidden mb-8">
          <div className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-start">
              <div className="flex-shrink-0 rounded-full p-3 mb-4 sm:mb-0">
                <div className="w-20 h-20 rounded-full bg-blue-500 flex items-center justify-center text-white text-3xl font-bold">
                  {session.user?.email?.charAt(0).toUpperCase()}
                </div>
              </div>
              <div className="sm:ml-6 text-center sm:text-left flex-1">
                <UserProfile 
                  session={session} 
                  newName={newName} 
                  setNewName={setNewName} 
                  handleUpdate={handleUpdate} 
                  loading={loading} 
                  message={message} 
                />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden lg:col-span-1">
            <div className="border-b border-gray-200">
              <div className="px-6 py-6 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-800">Following</h2>
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-3 py-0.5 rounded-full">
                  {following.length}
                </span>
              </div>
            </div>
            <div className="p-6">
              {following.length > 0 ? (
                <div className="space-y-3">
                  {following.map((email, index) => (
                    <div key={index} className="flex items-center py-3 px-1 rounded-lg hover:bg-gray-50">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-500 font-medium mr-3">
                        {email.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-gray-700 flex-1 truncate">{email}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                  </svg>
                  <p className="mt-2 text-gray-600">You're not following anyone yet.</p>
                </div>
              )}
            </div>
          </div>

          {/* My Blog Section */}
          <div className="overflow-hidden lg:col-span-2">
            <div>
            </div>
           
              <MyBlog />
          </div>
        </div>
      </div>
    </div>
  )}
</div>
    );
}
