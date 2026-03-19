import mongoose, { Schema, model, models } from "mongoose";

const AgentSchema = new Schema({
  userId: { type: String, unique: true, sparse: true },
  agentName: { type: String, default: "Sykalab-AI-ShopAgent" },
  agentIcon: { type: String, default: "https://sykasysbot.vercel.app/images/chat.png" },
  agentFont: { type: String, default: "Arial" },
  enableShopping: { type: Boolean, default: false },
  theme: {
    headerBg: { type: String, default: "#1d4ed8" },
    headerTextColor: { type: String, default: "#111827" },
    borderColor: { type: String, default: "#e5e7eb" },
    borderRadius: { type: String, default: "12px" },
    shadow: { type: String, default: "0 10px 25px rgba(0,0,0,0.1)" },
    windowBg: { type: String, default: "#f9fafb" },
  },
});

const Agent = models.Agent || model("Agent", AgentSchema);
export default Agent;