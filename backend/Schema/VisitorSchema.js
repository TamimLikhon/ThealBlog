import mongoose from "mongoose";

const visitorSchema = new mongoose.Schema({
  title: { type: String, required: true },
  authorEmail: { type: String, required: true },
  sessionId: { type: String, required: true },
  userAgent: { type: String, required: true },
  duration: { type: Number, required: true },
}, {
  timestamps: true, // adds createdAt and updatedAt fields
});

const Visit = mongoose.models.TrackVisit || mongoose.model("TrackVisit", visitorSchema);
export default Visit;