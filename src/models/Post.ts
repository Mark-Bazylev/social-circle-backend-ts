import mongoose, { Document, ObjectId } from "mongoose";
// Post schema fields
export interface PostDetails {
  _id?: ObjectId;
  createdBy: ObjectId;
  content: string;
  likes: ObjectId[];
  commentsLength: number;
}
interface PostDocument extends PostDetails, Document<ObjectId> {
  // Post schema methods
}
const PostSchema = new mongoose.Schema<PostDocument>(
  {
    createdBy: {
      type: mongoose.Types.ObjectId,
      required: [true, "Please provide user"],
      ref: "User",
    },
    content: {
      type: String,
      required: [true, "Please add text"],
      maxlength: 300,
    },
    likes: {
      type: [mongoose.Types.ObjectId],
      default: [],
    },

    commentsLength: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);
export default mongoose.model("Post", PostSchema);
