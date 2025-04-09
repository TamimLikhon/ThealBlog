import mongoose from "mongoose";

const TrackVisitorSchema = new mongoose.Schema({
  sessionId: { type: String, required: true, unique: true },
  userAgent: { type: String, required: true },

  urls: [
    {
      url: { type: String, required: true },
      startTimestamp: { type: Date, default: Date.now },
      endTimestamp: { type: Date },
      visitTimespan: { type: Number, default: 0 }, 
    }
  ],

 
});

const Visitor =
  mongoose.models.TrackVisitor || mongoose.model("TrackVisitor", TrackVisitorSchema);

export default Visitor;

