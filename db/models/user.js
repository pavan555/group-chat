import Mongoose from "mongoose";
import { getNewObjectId } from "../../utils/mongoose-utils";

const userSchema = new Mongoose.Schema(
  {
    _id: { type: String, default: getNewObjectId },
    password: {
      type: String,
      select: false,
    },
    name: String,
    emailId: {
      type: String,
      immutable: true,
    },
    admin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

userSchema.index({ emailId: 1 });

const User = Mongoose.model("users", userSchema);

export default User;
