import mongoose from "mongoose";

const MONGO_URI = process.env.MONGODB_URI!;
if (!MONGO_URI) throw new Error("Please define MONGODB_URI in env");

// Define a type for the cached connection
type MongooseGlobal = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

// Extend globalThis for TypeScript
declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseGlobal;
}

// Use cached connection
let cached: MongooseGlobal;

if (!global.mongoose) {
  global.mongoose = { conn: null, promise: null };
}

cached = global.mongoose;

export async function connectToDatabase(): Promise<typeof mongoose> {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGO_URI, {
      bufferCommands: false,
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}