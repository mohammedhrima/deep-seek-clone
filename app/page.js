"use client"
import { assets } from "@/assets/assets";
import Message from "@/components/Message";
import PromptBox from "@/components/PromptBox";
import Sidebar from "@/components/Sidebar";
import { useAppContext } from "@/context/AppContext";
import { useAuth, useClerk } from "@clerk/nextjs";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const { openSignIn } = useClerk();
  const { isLoaded, isSignedIn } = useAuth();
  const [expand, setExpand] = useState(false);
  const [messages, setMessages] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { selectedChat, user } = useAppContext()
  const containerRef = useRef(null);
  // const userRef = useRef(user);

  useEffect(() => {
    if (selectedChat) {
      setMessages(selectedChat.messages)
    }
  }, [selectedChat])

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behaviour: "smooth"
      })
    }
  }, [messages])

  return (
    <div>
      <div className="flex h-screen">
        <Sidebar expand={expand} setExpand={setExpand} />
        <div className="flex-1 flex flex-col items-center justify-center px-4 pb-8 bg-[#292a2d] text-white relative">

          <div className="md:hidden absolute px-4 top-6 flex items-center justify-between w-full">
            <Image alt="" onClick={() => setExpand(!expand)} className="rotate-180" src={assets.menu_icon} />
            <Image alt="" className="opacity-70" src={assets.chat_icon} />
          </div>
          {/* {user ? <h1>user found</h1> : <h1>user not found</h1>} */}
          {messages.length == 0 ? (
            <>
              <div className="flex items-center gap-3">
                <Image alt="" src={assets.logo_icon} className="h-16" />
                <p className="text-2xl font-medium">Hi, I'm DeepSeek Clone</p>
              </div>
              {user ?
                <p className="text-sm mt-2">How can I help you today ?</p> :
                <p className="text-sm mt-2">To start conversation, please <a onClick={openSignIn} className="cursor-pointer border-b border-blue-500 hover:border-blue-500 text-blue-500 hover:text-white transition-colors duration-200">authenticate</a> first</p>
                }

            </>
          ) : (
            <div ref={containerRef} className="relative flex flex-col items-center justify-start w-full
            mt-20 max-h-screen overflow-y-auto ">
              <p className="fixed top-8 border border-transparent hover:border-gray-500/50
              py-1 px-2 rounded-lg font-semibold mb-6">{selectedChat.name}</p>
              {messages.map((msg, index) => (<Message role={msg.role} content={msg.content} key={index} />))}
              {
                isLoading && (
                  <div className="flex gap-4 max-w-3xl w-full py-3">
                    <Image className="h-9 w-9 p-1 border border-white/15 rounded-full"
                      src={assets.logo_icon} alt="Logo" />
                    <div className="loader flex justify-center items-center gap-1">
                      <div className="w-1 h-1 rounded-full bg-white animate-bounce"></div>
                      <div className="w-1 h-1 rounded-full bg-white animate-bounce"></div>
                      <div className="w-1 h-1 rounded-full bg-white animate-bounce"></div>
                    </div>
                  </div>
                )
              }
            </div>
          )}
          {user && <PromptBox isLoading={isLoading} setIsLoading={setIsLoading} />}
          <p className="text-xs absolute bottom-1 text-gray-500">AI-generated, for reference only</p>
        </div>
      </div>
    </div>
  );
}
