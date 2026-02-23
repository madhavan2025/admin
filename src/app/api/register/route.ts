import { NextResponse } from "next/server";
import { db } from "@/lib/dt";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ message: "All fields required" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.execute(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, hashedPassword]
    );

    return NextResponse.json({ message: "User registered successfully" });
  } catch (error: any) {
    return NextResponse.json({ message: "Email already exists" }, { status: 500 });
  }
}