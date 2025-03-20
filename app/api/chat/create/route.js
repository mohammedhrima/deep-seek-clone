import connectDB from "@/config/db";
import Chat from "@/model/Chat";
import { getAuth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { userId } = getAuth(req);
    if (!userId) return NextResponse.json({ success: false, message: "User not authenticated" });

    // Prepare the chat data te be saved in the database
    const chatData = {
      userId,
      messages: [],
      name: "New Chat"
    }
    await connectDB()
    await Chat.create(chatData);
    return NextResponse.json({ success: true, message: "Chat created succefully" });
  } catch (error) {
    console.error("catch: POST /chat/create", error.message)
    return NextResponse.json({ success: false, message: error.message });
  }
}