import { NextResponse } from "next/server";
import { put, del } from "@vercel/blob";
import { db } from "@/lib/dt";

// ===============================
// UPLOAD AVATAR (Vercel Blob)
// ===============================
export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const userId = formData.get("userId") as string;

    if (!file || !userId) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    // Get old avatar from DB
    const [rows]: any = await db.execute(
      `SELECT avatar_url FROM user_profiles WHERE user_id = ?`,
      [userId]
    );

    const oldAvatar = rows?.[0]?.avatar_url;

    // Delete old image from Vercel Blob if exists
    if (oldAvatar) {
      try {
        await del(oldAvatar);
      } catch (err) {
        console.warn("Old avatar delete failed:", err);
      }
    }

    // Upload new image to Vercel Blob
    const blob = await put(`avatars/${Date.now()}-${file.name}`, file, {
      access: "public",
    });

    // Save blob URL to database
    await db.execute(
      `UPDATE user_profiles SET avatar_url = ? WHERE user_id = ?`,
      [blob.url, userId]
    );

    return NextResponse.json({ imageUrl: blob.url });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}

// ===============================
// DELETE AVATAR
// ===============================
export async function DELETE(req: Request) {
  try {
    const { userId, avatarUrl } = await req.json();

    if (!userId || !avatarUrl) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    // Delete from Vercel Blob
    try {
      await del(avatarUrl);
    } catch (err) {
      console.warn("Blob delete failed:", err);
    }

    // Remove from DB
    await db.execute(
      `UPDATE user_profiles SET avatar_url = NULL WHERE user_id = ?`,
      [userId]
    );

    return NextResponse.json({ message: "Deleted" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}