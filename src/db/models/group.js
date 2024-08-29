import Mongoose from "mongoose";
import { ObjectId } from "bson";
import { getNewObjectId } from "../../utils/mongoose-utils";

/**
 * {
    groupName,
    groupDescription: optional,
    groupMembers: [emailIds],
    createdBy,
    createdAt,
    updatedAt
}
 */
const groupSchema = new Mongoose.Schema(
  {
    _id: { type: String, default: getNewObjectId },
    name: String,
    description: String,
    members: [String],
    createdBy: String,
  },
  { timestamps: true}
);

groupSchema.index({ createdBy: 1 });

const Group = Mongoose.model("groups", groupSchema);

export default Group;
