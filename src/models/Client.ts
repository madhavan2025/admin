import mongoose, { Schema, model, models } from "mongoose";
import { v4 as uuidv4 } from "uuid";

const ClientSchema = new Schema(
  {
    clientId: {
      type: String,
      unique: true,
     default: () => uuidv4()
    },
    userId: {
      type: String,
      required: true,
      unique: true, // one client per user
    },
    clientName: {
      type: String,
      required: true,
    },
    clientUrl: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Client = models.Client || model("Client", ClientSchema);

export default Client;