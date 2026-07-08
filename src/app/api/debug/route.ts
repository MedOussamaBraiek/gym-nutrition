import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";

export async function GET() {
  const result: Record<string, unknown> = {
    hasMongoUri: !!process.env.MONGODB_URI,
    mongoUriPrefix: process.env.MONGODB_URI
      ? process.env.MONGODB_URI.substring(0, 35) + "..."
      : "not set",
    nodeEnv: process.env.NODE_ENV,
    mongooseState: ["disconnected", "connected", "connecting", "disconnecting"][mongoose.connection.readyState] || "unknown",
  };

  if (!result.hasMongoUri) {
    return NextResponse.json(result, { status: 500 });
  }

  try {
    await connectDB();
    result.connected = true;
    result.dbName = mongoose.connection.name || "unknown";
    result.host = mongoose.connection.host || "unknown";
  } catch (e) {
    result.connected = false;
    result.error = e instanceof Error ? e.message : String(e);
  }

  return NextResponse.json(result);
}
