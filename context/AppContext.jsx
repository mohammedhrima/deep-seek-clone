"use client"
import { useUser } from '@clerk/nextjs';
import React from 'react'
import { Children, createContext, useContext } from 'react'

export const AppContext = createContext();

export const useAppContext = () => {
    return useContext(AppContext)
}

function AppContextProvider({ children }) {
    const { user } = useUser();
    const value = { user };
    return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export default AppContextProvider