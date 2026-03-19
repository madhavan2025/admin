import { NextResponse } from "next/server";
import { db } from "@/lib/dt"; // database connection

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    const [rows]: any = await db.execute(
      `SELECT u.name, u.email, p.phone_number AS phoneNumber, p.username, p.bio
       FROM users u
       LEFT JOIN user_profiles p ON u.id = p.user_id
       WHERE u.id = ?`,
      [userId]
    );

    if (rows.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const {
      userId,
      fullName,
      email,
      phoneNumber,
      username,
      bio,
    } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    console.log("Updating user profile:", {
      userId,
      fullName,
      email,
      phoneNumber,
      username,
      bio,
    });

    // 1️⃣ Update users table (name + email)
    await db.execute(
      `UPDATE users SET name = ?, email = ? WHERE id = ?`,
      [fullName || "", email || "", userId]
    );

    // 2️⃣ Upsert user_profiles (INCLUDING full_name)
    await db.execute(
      `INSERT INTO user_profiles 
        (user_id, full_name, phone_number, username, bio)
       VALUES (?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         full_name = VALUES(full_name),
         phone_number = VALUES(phone_number),
         username = VALUES(username),
         bio = VALUES(bio)`,
      [
        userId,
        fullName || "",   // ✅ ADD THIS
        phoneNumber || "",
        username || "",
        bio || "",
      ]
    );

    return NextResponse.json({ message: "Profile updated successfully" });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}