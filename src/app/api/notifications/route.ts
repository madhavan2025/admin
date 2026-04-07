// app/api/notifications/route.ts
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mangoose";
import { NotificationModel } from "@/models/Notification";

export async function POST(req: Request) {
  try {
    await connectToDatabase();

    const body = await req.json();

    const { userId, title, message, role } = body;

    if (!userId || !title || !message) {
      return NextResponse.json(
        { error: "userId, title, and message are required" },
        { status: 400 }
      );
    }

    const newNotification = await NotificationModel.create({
      userId,
      title,
      message,
      role: role || "system", // default role
      status: "unseen",
    });

    return NextResponse.json(newNotification, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// app/api/notifications/route.ts

export async function PATCH(req: Request) {
  try {
    await connectToDatabase();

    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    await NotificationModel.updateMany(
      { userId, status: "unseen" },
      { $set: { status: "seen" } }
    );

    return NextResponse.json({ message: "Notifications marked as seen" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    const query = userId ? { userId } : {}; // ✅ allow optional filter

    const notifications = await NotificationModel.find(query)
      .sort({ createdAt: -1 })
      .limit(20);

    // ✅ convert _id to string (important for frontend)
    const formatted = notifications.map((item) => ({
      ...item.toObject(),
      _id: item._id.toString(),
    }));

    return NextResponse.json(formatted);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
