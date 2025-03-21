export const maxDuration = 60; //increase wait time for vercel server

import { getAuth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server";
import Chat from "@/model/Chat";
import connectDB from "@/config/db";

import fetch from 'node-fetch';

// Replace with your OpenRouter API key
const API_URL = 'https://openrouter.ai/api/v1/chat/completions';

async function sendMessage(conversation) {
  try {
    const headers = {
      'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
      'Content-Type': 'application/json',
    };
    const data = {
      model: "deepseek/deepseek-chat:free",
      messages: conversation,
    };
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(data),
    });

    // Check if the request was successful
    if (response.ok) {
      const result = await response.json();
      console.log("API Response:", result.choices[0].message);
      return result.choices[0].message;
    } else {
      console.log("Failed to fetch data from API. Status Code:", response.status);
      throw new Error("failed to fetch deepseek api")
    }
  } catch (error) {
    console.error("Error fetching data:", error.message);
    throw error
  }
}

export async function POST(req) {
  try {
    const { userId } = getAuth(req);
    console.log("/chat/ai userId", userId);

    // Extract chat id and prompt
    let { chatId, prompt } = await req.json();
    console.log("Sending the following prompt:", prompt);
    console.log("In this chat id:", chatId);

    // Validate required fields
    if (!userId) {
      return NextResponse.json({
        success: false,
        message: "User not authenticated",
      });
    }

    // Connect to the database
    await connectDB();

    // if(!chatId) throw new Error("Unxpected error chat id is NULL");
    // Find or create the chat document
    let data = null;
    if (chatId) {
      data = await Chat.findOne({ userId, _id: chatId });
    }
    if (!data) {
      // If chatId is null or invalid, generate a new ObjectId
      chatId = chatId || new mongoose.Types.ObjectId(); // Generate a new ObjectId if chatId is null
      data = new Chat({ userId, _id: chatId, messages: [] });
    }

    // Create user message object
    const userPrompt = {
      role: "user",
      content: prompt,
      timestamps: Date.now(),
    };
    data.messages.push(userPrompt);

    // Add AI response to chat
    const res = await sendMessage(data.messages);
    // const res = {
    //   role: "assitant",
    //   content: (prompt + " ").repeat(50),
    //   timestamps: Date.now(),
    // }
    // timestamps
    res.timestamps = Date.now();
    data.messages.push(res);

    // Save the updated chat document
    try {
      data.timestamps = Date.now();
      await data.save();
    } catch (saveError) {
      console.error("Failed to save chat data:", saveError);
      return NextResponse.json({
        success: false,
        message: "Failed to save chat data",
      });
    }

    // Return success response
    return NextResponse.json({
      success: true,
      data: res,
      _id: chatId,
    });
  } catch (error) {
    console.error("catch: POST /chat/ai", error);
    return NextResponse.json({
      success: false,
      message: error.message,
    });
  }
}
