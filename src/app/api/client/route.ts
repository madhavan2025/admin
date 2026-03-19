import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mangoose";
import Client from "@/models/Client";


// ✅ GET all clients
export async function GET(req: Request) {
  await connectToDatabase();

  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ success: false, data: null });
  }

  const client = await Client.findOne({ userId });

  return NextResponse.json({
    success: true,
    data: client || null, // 🔥 return null if not found
  });
}


// ✅ POST new client
export async function POST(req: Request) {
  await connectToDatabase();

  const body = await req.json();
  const { userId } = body;

  if (!userId) {
    return NextResponse.json({
      success: false,
      message: "userId is required",
    });
  }

  const existing = await Client.findOne({ userId });

  if (existing) {
    return NextResponse.json({
      success: false,
      message: "Client already exists for this user",
    });
  }

  const client = await Client.create(body);

  return NextResponse.json({ success: true, data: client });
}


// ✅ UPDATE client
// ✅ UPDATE client (use clientId, NOT userId)
export async function PUT(req: Request) {
  await connectToDatabase();

  const body = await req.json();
  const { clientId, clientName, clientUrl } = body;

  const updated = await Client.findOneAndUpdate(
    { clientId }, // 🔥 use clientId here
    { clientName, clientUrl },
    { new: true }
  );

  return NextResponse.json({ success: true, data: updated });
}