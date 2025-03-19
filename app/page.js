"use client"
import { assets } from "@/assets/assets";
import Sidebar from "@/components/Sidebar";
import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [expand, setExpand] = useState(false);
  const [message, setMessages] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div>
      <div className="flex h-screen">
        <Sidebar expand={expand} setExpand={setExpand}/>
        <div className="flex-1 flex flex-col items-center justify-center px-4 pb-8 bg-[#292a2d] text-white relative">

          <div className="md:hidden absolute px-4 top-6 flex items-center justify-between w-full">
            <Image alt="" onClick={() => setExpand(!expand)} className="rotate-180" src={assets.menu_icon} />
            <Image alt="" className="opacity-70" src={assets.chat_icon} />
          </div>

          {message.length === 0 ? (
            <>
              <div>
                <Image alt="" src={assets.logo_icon} className="h-16" />
                <p className="text-2xl font-medium">Hi, I'm DeepSeek</p>
              </div>
              <p className="text-sm mt-2">How can I help you today ?</p>
            </>
          ) : (
            <div>

            </div>
          )}
          {/* prompt box */}
          <p className="text-xs absolute bottom-1 text-gray-500">AI-generated, for reference only</p>
        </div>
      </div>
    </div>
  );
}
