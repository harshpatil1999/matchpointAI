import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  image: string;
  subscription: Date | null;
  freeRequestsUsed: number;
  hasProAccess(): boolean;
  canMakeRequest(): boolean;
}

const userSchema: Schema<IUser> = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    image: {
      type: String,
      required: true,
    },
    subscription: {
      type: Date,
      default: null,
    },
    freeRequestsUsed: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

userSchema.methods.hasProAccess = function (): boolean {
  return !!this.subscription && new Date() < new Date(this.subscription);
};

userSchema.methods.canMakeRequest = function (): boolean {
  return this.hasProAccess() || this.freeRequestsUsed < 3;
};

const User = mongoose.model<IUser>("User", userSchema);

export default User;
