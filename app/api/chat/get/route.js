import connectDB from "@/config/db";
import Chat from "@/model/Chat";
import { getAuth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { userId } = getAuth(req);
    console.log("find user with id: ", userId);

    if (!userId) {
      return NextResponse.json({
        success: false,
        message: "User not authenticated",
      })
    }

    await connectDB();
    const data = await Chat.find({ userId });
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("catch: GET /chat/ai/get", error.message)
    return NextResponse.json({ success: false, message: error.message });
  }
}