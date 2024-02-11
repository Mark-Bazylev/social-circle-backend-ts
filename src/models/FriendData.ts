import mongoose, { Document, ObjectId } from "mongoose";
import FriendData from "./FriendData";
// Friend Data schema fields

export interface FriendDataDetails {
  _id?: ObjectId;
  createdBy: ObjectId;
  sentRequests: ObjectId[];
  receivedRequests: ObjectId[];
  friendsList: ObjectId[];
}
interface FriendDataDocument extends FriendDataDetails, Document<ObjectId> {
  // Friend Data schema methods
}

const userIdDefinition = { type: mongoose.Types.ObjectId, ref: "User" };
const FriendsDataSchema = new mongoose.Schema<FriendDataDocument>(
  {
    createdBy: {
      unique: true,
      required: [true, "Please provide user"],
      ...userIdDefinition,
    },
    sentRequests: [userIdDefinition],
    receivedRequests: [userIdDefinition],
    friendsList: [userIdDefinition],
  },
  { timestamps: true },
);

export default mongoose.model("FriendsData", FriendsDataSchema);
