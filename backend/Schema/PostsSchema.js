// import mongoose from "mongoose";

// const PostSchema = new mongoose.Schema(
//   {
//     title: { type: String, required: true },
//     content: { type: String, required: true },
//     authorEmail: { type: String, required: true },
//     createdAt: { type: Date, default: Date.now },
//     updatedAt: { type: Date, default: Date.now },
//   },
//   { timestamps: true }
// );

// const Post = mongoose.models.Post || mongoose.model("Post", PostSchema);
// export default Post;


import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema(
  {
    userEmail: { type: String, required: true },
    text: { type: String, required: true },
    date: { type: Date, default: Date.now },
    edited: { type: Boolean, default: false },
    replies: [
      {
        userEmail: { type: String, required: true },
        text: { type: String, required: true },
        date: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

const PostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true }, // Use title as identifier
    content: { type: String, required: true },
    authorEmail: { type: String, required: true },
    likes: [{ type: String }], // Array of user emails who liked the post
    comments: [CommentSchema],
  },
  { timestamps: true }
);

const Post = mongoose.models.Post || mongoose.model("Post", PostSchema);
export default Post;
