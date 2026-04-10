import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mangoose";
import Client from "@/models/Client";

// ✅ Helper: Extract origin safely
const getOrigin = (req: Request) => {
  return req.headers.get("origin") || "";
};

// ✅ Helper: Domain validation
const isDomainAllowed = (origin: string, client: any) => {
  if (!origin || !client?.allowedDomains?.length) return false;

  return client.allowedDomains.some((domain: string) => {
    if (client?.cors?.allowSubdomains) {
      return origin.endsWith(domain);
    }
    return origin.includes(domain);
  });
};



// ✅ GET client
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
    data: client || null,
  });
}



// ✅ POST new client
export async function POST(req: Request) {
  await connectToDatabase();

  const body = await req.json();
  const { userId, allowedDomains = [] } = body;

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

  const client = await Client.create({
    ...body,
    allowedDomains, // ✅ save domains
  });

  return NextResponse.json({ success: true, data: client });
}



// ✅ UPDATE client (with domains)
export async function PUT(req: Request) {
  await connectToDatabase();

  const body = await req.json();

  const {
    clientId,
    clientName,
    clientUrl,
    allowedDomains = [],
  } = body;

  const updated = await Client.findOneAndUpdate(
    { clientId },
    {
      clientName,
      clientUrl,
      allowedDomains, // ✅ update domains
    },
    { new: true }
  );

  return NextResponse.json({ success: true, data: updated });
}