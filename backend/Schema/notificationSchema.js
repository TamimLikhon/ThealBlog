// import mongoose from "mongoose";

// const NotificationSchema = new mongoose.Schema(
//   {
//     receiverEmail: { type: String, required: true }, // Post author or comment owner
//     type: { type: String, enum: ["comment", "like", "reply"], required: true },
//     postTitle: { type: String, required: true },
//     commentId: { type: mongoose.Schema.Types.ObjectId, ref: "Post", default: null },
//     triggeredBy: { type: String, required: true }, // User who performed the action
//     message: { type: String, required: true },
//     read: { type: Boolean, default: false },
//     createdAt: { type: Date, default: Date.now },
//   },
//   { timestamps: true }
// );

// const Notification = mongoose.models.Notification || mongoose.model("Notification", NotificationSchema);
// export default Notification;
