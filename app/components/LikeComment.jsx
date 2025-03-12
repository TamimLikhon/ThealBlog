"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Heart, MessageCircle, SendHorizontal, User } from "lucide-react";

export default function LikeComment({ title }) {
    const { data: session } = useSession();
    const [likes, setLikes] = useState([]);
    const [comments, setComments] = useState([]);
    const [commentText, setCommentText] = useState("");
    const [replyText, setReplyText] = useState({});
    const [showReplyInput, setShowReplyInput] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
  
    useEffect(() => {
        const fetchPostData = async () => {
            try {
                const response = await fetch(`/api/fetchpost?title=${title}`);
                const data = await response.json();
                setLikes(data.likes || []); 
                setComments(data.comments || []); 
            } catch (error) {
                console.error("Error fetching post data:", error);
            }
        };

        if (title) {
            fetchPostData();
        }
    }, [title]);

    const handleLike = async () => {
        if (!session?.user?.email) {
            alert("You need to sign in first.");
            return;
        }

        try {
            setIsSubmitting(true);
            const response = await fetch("/api/reaction/like", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ title, userEmail: session.user.email }),
            });

            const data = await response.json();
            if (response.ok) {
                setLikes(data.likes || []); 
            }
        } catch (error) {
            console.error("Error liking post:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleComment = async () => {
        if (!session?.user?.email) {
            alert("You need to sign in first.");
            return;
        }

        if (!commentText.trim()) return;

        try {
            setIsSubmitting(true);
            const response = await fetch("/api/reaction/comment", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ title, userEmail: session.user.email, text: commentText }),
            });

            const data = await response.json();
            if (response.ok) {
                setComments(data.comments || []); 
                setCommentText(""); 
            }
        } catch (error) {
            console.error("Error adding comment:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const toggleReplyInput = (commentId) => {
        setShowReplyInput(prev => ({
            ...prev,
            [commentId]: !prev[commentId]
        }));
        
        if (!showReplyInput[commentId]) {
            setReplyText(prev => ({ ...prev, [commentId]: "" }));
        }
    };

    const handleReply = async (commentId) => {
        if (!session?.user?.email) {
            alert("You need to sign in first.");
            return;
        }

        if (!replyText[commentId]?.trim()) return;

        try {
            setIsSubmitting(true);
            const response = await fetch("/api/reaction/reply", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ 
                    title, 
                    commentId, 
                    userEmail: session.user.email, 
                    text: replyText[commentId] 
                }),
            });

            const data = await response.json();
            if (response.ok) {
                setComments(data.comments || []); 
                setReplyText((prev) => ({ ...prev, [commentId]: "" }));
                setShowReplyInput(prev => ({ ...prev, [commentId]: false }));
            }
        } catch (error) {
            console.error("Error adding reply:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const formatEmail = (email) => {
        if (!email) return "";
        const parts = email.split('@');
        if (parts.length !== 2) return email;
        
        return parts[0].length > 10 
            ? `${parts[0].substring(0, 8)}...@${parts[1]}`
            : email;
    };

    return (
        <div className="mt-8 rounded-xl bg-white shadow-lg border border-gray-100">
            {/* Engagement Bar */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <button 
                    onClick={handleLike} 
                    disabled={isSubmitting}
                    
                >
                    <Heart className={"w-5 h-5"} />
                    <span className="font-medium">{likes.length}</span>
                </button>
                
                <div className="text-sm text-gray-500">
                    {comments.length} {comments.length === 1 ? "comment" : "comments"}
                </div>
            </div>

            {/* Add Comment */}
            <div className="px-6 py-4">
                <div className="flex space-x-3">
                    <div className="flex-shrink-0">
                        <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                            <User className="w-5 h-5" />
                        </div>
                    </div>
                    <div className="flex-grow">
                        <div className="relative">
                            <textarea
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                className="w-full px-4 py-2 pr-12 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-300 outline-none transition-all resize-none"
                                placeholder="Write a comment..."
                                rows="2"
                            />
                            <button 
                                onClick={handleComment}
                                disabled={isSubmitting || !commentText.trim()} 
                                className={`absolute right-2 bottom-2 p-2 rounded-full ${
                                    commentText.trim() 
                                        ? "text-blue-600 hover:bg-blue-50" 
                                        : "text-gray-400"
                                }`}
                            >
                                <SendHorizontal className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Comments List */}
            {comments.length > 0 && (
                <div className="px-6 py-2 divide-y divide-gray-100">
                    {comments.map((comment) => (
                        <div key={comment._id} className="py-4">
                            <div className="flex space-x-3">
                                <div className="flex-shrink-0">
                                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-500">
                                        {comment.userEmail.charAt(0).toUpperCase()}
                                    </div>
                                </div>
                                <div className="flex-grow">
                                    <div className="bg-gray-50 rounded-lg px-4 py-3">
                                        <p className="text-sm font-medium text-gray-900">{formatEmail(comment.userEmail)}</p>
                                        <p className="text-sm text-gray-700 mt-1">{comment.text}</p>
                                    </div>
                                    
                                    <div className="mt-1 ml-1">
                                        <button 
                                            onClick={() => toggleReplyInput(comment._id)}
                                            className="text-xs font-medium text-gray-500 hover:text-blue-600"
                                        >
                                            {showReplyInput[comment._id] ? "Cancel" : "Reply"}
                                        </button>
                                    </div>

                                    {/* Reply input */}
                                    {showReplyInput[comment._id] && (
                                        <div className="mt-3 flex space-x-2">
                                            <div className="flex-grow">
                                                <div className="relative">
                                                    <input
                                                        type="text"
                                                        value={replyText[comment._id] || ""}
                                                        onChange={(e) => setReplyText({ ...replyText, [comment._id]: e.target.value })}
                                                        className="w-full px-3 py-2 pr-10 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-300 outline-none"
                                                        placeholder="Write a reply..."
                                                    />
                                                    <button 
                                                        onClick={() => handleReply(comment._id)}
                                                        disabled={isSubmitting || !replyText[comment._id]?.trim()} 
                                                        className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded-full ${
                                                            replyText[comment._id]?.trim() 
                                                                ? "text-blue-600 hover:bg-blue-50" 
                                                                : "text-gray-400"
                                                        }`}
                                                    >
                                                        <SendHorizontal className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Replies */}
                                    {comment.replies && comment.replies.length > 0 && (
                                        <div className="mt-3 space-y-3 pl-3 border-l-2 border-gray-100">
                                            {comment.replies.map((reply, index) => (
                                                <div key={index} className="flex space-x-3">
                                                    <div className="flex-shrink-0">
                                                        <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center text-purple-500 text-xs">
                                                            {reply.userEmail.charAt(0).toUpperCase()}
                                                        </div>
                                                    </div>
                                                    <div className="flex-grow">
                                                        <div className="bg-gray-50 rounded-lg px-3 py-2">
                                                            <p className="text-xs font-medium text-gray-900">{formatEmail(reply.userEmail)}</p>
                                                            <p className="text-xs text-gray-700">{reply.text}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            
            {/* Empty State */}
            {comments.length === 0 && (
                <div className="px-6 py-8 text-center">
                    <MessageCircle className="w-12 h-12 mx-auto text-gray-300" />
                    <p className="mt-2 text-gray-500 font-medium">No comments yet</p>
                    <p className="text-sm text-gray-400">Be the first to share your thoughts</p>
                </div>
            )}
        </div>
    );
}