import { NextResponse } from "next/server";
import { db } from "@/lib/dt";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  const [rows]: any = await db.execute(
    `SELECT avatar_url FROM user_profiles WHERE user_id = ?`,
    [userId]
  );

  return NextResponse.json({
    avatarUrl: rows?.[0]?.avatar_url || "",
  });
}