import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mangoose";
import Agent from "@/models/Agent";
import jwt from "jsonwebtoken";

const SECRET = "MY_SECRET_KEY";

async function getUserIdFromToken(req: Request) {
  const authHeader =
    req.headers.get("authorization") ||
    req.headers.get("Authorization");

  if (!authHeader) return null;

  const token = authHeader.replace("Bearer ", "");

  try {
    const decoded: any = jwt.verify(token, SECRET);
    return decoded.id;
  } catch (err) {
    console.log("Token error:", err);
    return null;
  }
}

export async function GET(req: Request) {
  try {
    await connectToDatabase();

    const userId = await getUserIdFromToken(req);
    let agent = null;

    // 1️⃣ Try user settings
    if (userId) {
      agent = await Agent.findOne({ userId });
    }

    // 2️⃣ Fallback to default config
    if (!agent) {
      agent = await Agent.findOne({ name: "default" });
    }

    return NextResponse.json(agent);

  } catch (error) {
    console.error("GET /api/agent error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectToDatabase();

    const userId = await getUserIdFromToken(req);
    console.log("UserId from token:", userId);
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
  console.log("Payload:", body);
    // Ensure enableShopping is boolean
    body.enableShopping = !!body.enableShopping;

    

    const updatedAgent = await Agent.findOneAndUpdate(
      { userId },
      { ...body, userId },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    return NextResponse.json(updatedAgent);
  } catch (error) {
    console.error("POST /api/agent error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}