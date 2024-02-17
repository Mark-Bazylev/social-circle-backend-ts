import mongoose, { Document, ObjectId } from "mongoose";

export interface CommentDetails {
  _id?: ObjectId;
  createdBy: ObjectId;
  commentedIn: ObjectId;
  content: string;
  likes: ObjectId[];
}

interface CommentDocument extends CommentDetails, Document<ObjectId> {
  // Post schema methods
}

const CommentSchema = new mongoose.Schema<CommentDocument>(
  {
    content: {
      type: String,
      required: [true, "Please add text"],
      maxlength: 300,
    },
    likes: { type: [mongoose.Types.ObjectId], default: [] },
    createdBy: {
      type: mongoose.Types.ObjectId,
      required: [true, "Please provide createdBy"],
    },
    commentedIn: {
      type: mongoose.Types.ObjectId,
      required: [true, "Please provide origin Post"],
    },
  },
  { timestamps: true },
);

export default mongoose.model("Comment", CommentSchema);
