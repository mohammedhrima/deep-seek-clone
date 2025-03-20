"use client"
import { useUser, useAuth } from '@clerk/nextjs';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { createContext, useContext } from 'react'
import toast from 'react-hot-toast';

export const AppContext = createContext();

export const useAppContext = () => {
  return useContext(AppContext)
}

function AppContextProvider({ children }) {
  const { user } = useUser();
  const { getToken } = useAuth()

  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState({ messages: [] });

  const createNewChat = async () => {
    try {
      if (!user) return NULL;
      const token = await getToken();
      await axios.post("/api/chat/create", {}, { headers: { Authorization: `Bearer ${token}` } })
      fetchUsersChats();
    } catch (error) {
      console.error("creating chat:", error.message);
      toast.error(error.message);
    }
  }

  const fetchUsersChats = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get("/api/chat/get", { headers: { Authorization: `Bearer ${token}` } })
      if (data.success) {
        console.log(data.data);
        setChats(data.data);

        // if user has not chats, create new one
        if (data.data.length === 0) {
          console.log("user has no chat create new one");
          await createNewChat();
          return fetchUsersChats();
        }
        else {
          console.log("user already has chat:", data.dataZZ);
          data.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          setSelectedChat(data.data[0])
          console.log(data.data[0]);
        }
      }
      else {
        console.error(data.message);
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error.message);
      toast.error(error.message);
    }
  }
  useEffect(() => {
    if (user) fetchUsersChats();
  }, [user])
  const value = { user, chats, setChats, selectedChat, setSelectedChat, fetchUsersChats, createNewChat };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export default AppContextProvider