// models/Notification.ts
import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    status: {
      type: String,
      enum: ["seen", "unseen"],
      default: "unseen",
    },
    role: {
      type: String,
      enum: ["admin", "user", "system"],
      default: "system",
    },
  },
  { timestamps: true }
);

export const NotificationModel =
  mongoose.models.Notification ||
  mongoose.model("Notification", NotificationSchema);