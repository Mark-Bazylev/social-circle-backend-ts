import mongoose, { Document, ObjectId } from "mongoose";
// Account schema fields
export interface AccountDetails {
  _id?: ObjectId;
  createdBy: ObjectId;
  firstName: string;
  lastName: string;
  coverImageName: string;
  avatarImageName: string;
}
interface AccountDocument extends AccountDetails, Document<ObjectId> {
  // Account schema methods
}
const AccountSchema = new mongoose.Schema<AccountDocument>(
  {
    createdBy: {
      unique: true,
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide user"],
    },
    firstName: {
      type: String,
      required: [true, "Please provide firstName"],
      minlength: 1,
      maxlength: 30,
    },
    lastName: {
      type: String,
      required: [true, "Please provide lastName"],
      minlength: 1,
      maxlength: 50,
    },
    coverImageName: {
      type: String,
      required: [true, "Please provide cover Image"],
    },
    avatarImageName: {
      type: String,
      required: [true, "Please provide avatar Image"],
    },
  },
  { timestamps: true },
);

export default mongoose.model("Account", AccountSchema);
