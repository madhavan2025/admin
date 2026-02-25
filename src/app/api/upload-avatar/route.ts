import { NextResponse } from "next/server";
import { writeFile, unlink } from "fs/promises";
import path from "path";
import { db } from "@/lib/dt";

const BASE_URL = "https://admin-weld-beta-21.vercel.app"; // Your site URL

// Upload avatar
export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const userId = formData.get("userId") as string;

    if (!file || !userId) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    // Get old avatar
    const [rows]: any = await db.execute(
      `SELECT avatar_url FROM user_profiles WHERE user_id = ?`,
      [userId]
    );
    const oldAvatar = rows?.[0]?.avatar_url;

    // Delete old file if exists
    if (oldAvatar) {
      const oldFileName = oldAvatar.split("/images/")[1];
      const oldPath = path.join(process.cwd(), "public/images", oldFileName);
      try {
        await unlink(oldPath);
      } catch (err) {
        console.warn("Old avatar not found:", err);
      }
    }

    // Save new file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const fileName = `${Date.now()}-${file.name}`;
    const filePath = path.join(process.cwd(), "public/images", fileName);

    await writeFile(filePath, buffer);

    // Full public URL to store in DB
    const imageUrl = `${BASE_URL}/images/${fileName}`;

    await db.execute(
      `UPDATE user_profiles SET avatar_url = ? WHERE user_id = ?`,
      [imageUrl, userId]
    );

    return NextResponse.json({ imageUrl });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}

// Delete avatar
export async function DELETE(req: Request) {
  try {
    const { userId, avatarUrl } = await req.json();

    if (!userId || !avatarUrl) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    const fileName = avatarUrl.split("/images/")[1];
    const filePath = path.join(process.cwd(), "public/images", fileName);

    try {
      await unlink(filePath);
    } catch (err) {
      console.warn("File not found or already deleted:", err);
    }

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