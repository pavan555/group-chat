import Mongoose from "mongoose";
import { getNewObjectId } from "../../utils/mongoose-utils";

/**
 * {
    groupId,
    message,
    likes: [emailIds],
    createdBy,
    createdAt,
    updatedAt
}
 */
const messageSchema = new Mongoose.Schema(
  {
    _id: { type: String, default: getNewObjectId },
    groupId: String,
    message: String,
    likes: [String],
    createdBy: String,
  },
  { timestamps: true }
);

messageSchema.index({ groupId: 1 });

const Message = Mongoose.model("messages", messageSchema);

export default Message;
