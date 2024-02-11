import mongoose, { Schema, Document, ObjectId } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { emailRegex } from "../utils";

// User schema fields
export interface UserDetails {
  _id?: ObjectId;
  email: string;
  password: string;
}
interface UserDocument extends UserDetails, Document<ObjectId> {
  // User schema methods
  createJWT: () => string; // define the createJWT method
  comparePassword: (candidatePassword: string) => Promise<boolean>; // define the createJWT method
}

const UserSchema = new Schema<UserDocument>({
  email: {
    type: String,
    required: [true, "Please provide email"],
    match: [emailRegex, "Please provide valid email"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please provide password"],
  },
});
UserSchema.methods.createJWT = function () {
  return jwt.sign(
    {
      user: this,
    },
    process.env.JWT_SECRET as string,
    {
      expiresIn: process.env.JWT_LIFETIME,
    },
  );
};

UserSchema.methods.comparePassword = async function (
  candidatePassword: string,
) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password);
  console.log(candidatePassword, this.password);
  console.log(isMatch);
  return isMatch;
};
export default mongoose.model("User", UserSchema);
