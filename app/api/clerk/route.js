import { Webhook } from "svix";
import connectDB from "@/config/db";
import User from "@/model/User";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req) {
  try {
    const wh = new Webhook(process.env.SIGNING_SECRET)
    const headerPayload = await headers();
    const svixHeaders = {
      "svix-id": headerPayload.get("svix-id"),
      "svix-timestamp": headerPayload.get("svix-timestamp"),
      "svix-signature": headerPayload.get("svix-signature"),
    }
    // Get the payload and verify it
    const payload = await req.json();
    const body = JSON.stringify(payload);
    const { data, type } = wh.verify(body, svixHeaders);

    // prepare data to be saved in the database
    const userData = {
      _id: data.id,
      email: data.email_addresses[0].email_address,
      name: `${data.first_name} ${data.last_name}`,
      image: data.image_url
    };
    await connectDB();

    console.log(`Processing event: ${type}`);
    console.log(`User data:`, userData);

    switch (type) {
      case "user.created":
        console.log("create user");
        
        await User.create(userData);
        break;
      case "user.updated":
        await User.findByIdAndUpdate(data.id, userData);
        break;
      case "user.deleted":
        await User.findByIdAndDelete(data.id);
        break;
      default:
        console.warn(`Unhandled event type: ${type}`);
        break;
    }
    // return NextRequest.json({message:"Event recieved"})
    return NextResponse.json({ message: "Event received" })
  } catch (error) {
    console.error("POST /clerk", error.message)
  }
}