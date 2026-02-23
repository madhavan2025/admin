import { NextResponse } from "next/server";
import { db } from "@/lib/dt";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const SECRET = "MY_SECRET_KEY";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  const [rows]: any = await db.execute(
    "SELECT * FROM users WHERE email = ?",
    [email]
  );

  if (rows.length === 0) {
    return NextResponse.json({ message: "User not found" }, { status: 400 });
  }

  const user = rows[0];

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return NextResponse.json({ message: "Invalid password" }, { status: 400 });
  }

  const token = jwt.sign(
    { id: user.id, email: user.email },
    SECRET,
    { expiresIn: "1d" }
  );

  return NextResponse.json({ token });
}