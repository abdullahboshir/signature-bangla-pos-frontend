"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface LoadingContextType {
    isLoading: boolean;
    message: string;
    setLoading: (loading: boolean, message?: string) => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export function LoadingProvider({ children }: { children: ReactNode }) {
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState("Loading...");

    const setLoading = (loading: boolean, msg: string = "Loading...") => {
        setIsLoading(loading);
        setMessage(msg);
    };

    return (
        <LoadingContext.Provider value={{ isLoading, message, setLoading }}>
            {children}
        </LoadingContext.Provider>
    );
}

export function useLoadingStore() {
    const context = useContext(LoadingContext);
    if (!context) {
        throw new Error("useLoadingStore must be used within LoadingProvider");
    }
    return context;
}
