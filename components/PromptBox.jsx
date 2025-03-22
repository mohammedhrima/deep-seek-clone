import { assets } from '@/assets/assets'
import { useAppContext } from '@/context/AppContext';
import axios from 'axios';
import Image from 'next/image'
import React, { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast';

function PromptBox({ isLoading, setIsLoading }) {
  const [prompt, setPrompt] = useState("");
  const { user, chats, setChats, selectedChat, setSelectedChat } = useAppContext();
  const selectedId = useRef(selectedChat._id);

  useEffect(() => {
    selectedId.current = selectedChat._id;
  }, [selectedChat]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendPrompt(e)
    }
  }

  const sendPrompt = async (e) => {
    const promptCopy = prompt;
    try {
      e.preventDefault();
      if (!user) return toast.error('Login to send message');
      if (isLoading) return toast.error('Wait for the previous prompt response');
      setIsLoading(false);
      setPrompt("");

      const { data } = await axios.post("/api/chat/ai", { chatId: selectedChat._id, prompt: prompt })
      let startTime = Date.now();
      setChats((prev) => {
        const chatIndex = prev.findIndex((chat) => chat._id === selectedId.current);
        if (chatIndex === -1) return prev;
        // console.log("chat: ", prev[chatIndex]);
        const updatedChat = {
          ...prev[chatIndex],
          messages: [
            ...prev[chatIndex].messages,
            {
              role: "user",
              content: prompt,
              timestamps: startTime,
            }
          ],
        };
        const updatedChats = [...prev];
        updatedChats[chatIndex] = updatedChat;
        const [movedChat] = updatedChats.splice(chatIndex, 1);
        updatedChats.unshift(movedChat);
        return updatedChats;
      });
      
      if (data.success) {
        const message = data.data.content;
        const messageTokens = message.split(' ');

        // update chats order in side bar
        setChats((prev) => {
          const chatIndex = prev.findIndex((chat) => chat._id === selectedId.current);
          if (chatIndex === -1) return prev;
          // console.log("chat: ", prev[chatIndex]);
          const updatedChat = {
            ...prev[chatIndex],
            messages: [
              ...prev[chatIndex].messages,
              {
                role: "assistant",
                content: message,
                timestamps: Date.now(),
              },
            ],
          };
          const updatedChats = [...prev];
          updatedChats[chatIndex] = updatedChat;
          const [movedChat] = updatedChats.splice(chatIndex, 1);
          updatedChats.unshift(movedChat);
          return updatedChats;
        });

        let delay = 1;
        const simulateTyping = async () => {
          for (let i = 0; i < messageTokens.length && selectedId.current == selectedChat._id; i++) {
            await sleep(delay);
            if (selectedId.current !== selectedChat._id) {
              return;
            }
            const newContent = messageTokens.slice(0, i + 1).join(' ');
            setSelectedChat((prev) => {
              const updatedMessages = [
                ...prev.messages.slice(0, -1),
                {
                  role: 'assistant',
                  content: newContent,
                  timestamps: Date.now(),
                },
              ];
              return { ...prev, messages: updatedMessages };
            });
          }
        };
        await simulateTyping();
      }
      else {
        console.error(data.message);
        toast.error("failed to send user prompt: " + data.message);
        setPrompt(promptCopy)
      }
    } catch (error) {
      console.error(error.message);
      if (error.message) toast.error(error.message);
      setPrompt(promptCopy)
    } finally {
      setIsLoading(false);
    }
  }
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  return (
    <form onSubmit={sendPrompt}
      className={`w-full ${selectedChat.messages.length > 0 ? "max-w-3xl" : "max-w-2xl"} bg-[#404045] p-4 rounded-3xl mt-4 transition-all`}>
      <textarea onKeyDown={handleKeyDown}
        rows={2} placeholder='Message to DeepSeek' required className='outline-none w-full resize-none overflow-hidden break-words bg-transparent' onChange={(e) => setPrompt(e.target.value)} value={prompt} />
      <div className='flex items-center justify-between text-sm'>
        <div className='flex items-center gap-2'>
          <p className='flex items-center gap-2 text-xs border border-gray-300/40 px-2 py-1 rounded-full cursor-pointer hover:bg-gray-500/20 transition'>
            <Image src={assets.deepthink_icon} alt='' className='h-5' />
            DeepThink (R1)
          </p>
          <p className='flex items-center gap-2 text-xs border border-gray-300/40 px-2 py-1 rounded-full cursor-pointer hover:bg-gray-500/20 transition'>
            <Image src={assets.search_icon} alt='' className='h-5' />
            Search
          </p>
        </div>
        <div className='flex items-center gap-2'>
          <Image src={assets.pin_icon} alt='' className='w-4 cursor-pointer' />
          <button className={`${prompt.length ? "bg-primary" : "bg-[#71717a]"} rounded-full p-2 cursor-pointer`}>
            <Image src={prompt.length ? assets.arrow_icon : assets.arrow_icon_dull} alt='' className='w-3.5 aspect-square' />
          </button>
        </div>
      </div>
    </form>
  )
}

export default PromptBox

