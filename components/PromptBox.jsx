import { assets } from '@/assets/assets'
import { useAppContext } from '@/context/AppContext';
import axios from 'axios';
import Image from 'next/image'
import React, { useState } from 'react'
import toast from 'react-hot-toast';

function PromptBox({ isLoading, setIsLoading }) {
  const [prompt, setPrompt] = useState("");
  const { user, chats, setChats, selectedChat, setSelectedChat } = useAppContext();

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
      const userPrompt = {
        role: "user",
        content: prompt,
        timestamps: Date.now(),
      }

      // save user prompt in chats array
      setChats((prevChats) => prevChats.map((chat) => chat._id === selectedChat._id ? {
        ...chat,
        messages: [...chat.messages, userPrompt]
      } : chat))

      // save user prompt in selected chats
      setSelectedChat((prev) => ({
        ...prev,
        messages: [...prev.messages, userPrompt]
      }))

      const { data } = await axios.post("/api/chat/ai", { chatId: selectedChat._id, prompt: prompt })
      if (data.success) {
        console.log("recieved message fomr ai succefully", data.data);
        
        setChats(prevChats => prevChats.map(chat => chat._id === selectedChat._id ? { ...chat, messages: [...chat.messages, data.data] } : chat))

        const message = data.data.content;
        const messageTokens = message.split(" ");
        let assistantMessage = {
          role: "assistant",
          content: "",
          timestamps: Date.now(),
        }

        setSelectedChat(prev => ({
          ...prev,
          messages: [...prev.messages, assistantMessage],
        }))

        for (let i = 0; i < messageTokens.length; i++) {
          setTimeout(() => {
            assistantMessage.content = messageTokens.slice(0, i + 1).join(" ");
            setSelectedChat(prev => {
              const updateMessages = [
                ...prev.messages.slice(0, -1),
                assistantMessage
              ]
              return { ...prev, messages: updateMessages }
            })
          }, i * 100);

        }
      }
      else {
        console.error(data.message);
        toast.error(data.message);
        setPrompt(promptCopy)
      }
    } catch (error) {
      console.error(error.message);
      if(error.message) toast.error(error.message);
      setPrompt(promptCopy)
    } finally {
      setIsLoading(false);
    }
  }
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