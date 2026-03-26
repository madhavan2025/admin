import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/mangoose";

export async function GET(req: Request) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const customerId = searchParams.get("customerId");

    const db = mongoose.connection.db;
if (!db) throw new Error("DB not connected");

     const chats = await db.collection("chats")
      .find({
        ...(customerId && { customerId }),
      })
      .toArray();

    const result: any[] = [];

    chats.forEach((chat: any) => {
      chat?.qaPairs?.forEach((qa: any) => {
        result.push({
          dateTime: chat?.createdAt || null,
          userId: chat?.userId || "",
          chatId: chat?.chatId || "",
          question: qa?.question?.parts?.[0]?.text || "",
          answer: qa?.answer?.parts?.[0]?.text || "",
        });
      });
    });

    return NextResponse.json({ data: result });
  } catch (error) {
    console.error("Error fetching chats:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}