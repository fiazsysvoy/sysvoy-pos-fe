"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface User {
    id?: string;
    name: string;
    email: string;
    role: string;
    organization?: {
        name: string;
        [key: string]: any;
    };
    [key: string]: any;
}

interface UserContextType {
    user: User | null;
    loading: boolean;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const fetchUser = async () => {
        try {
            const res = await api.get("/api/account/");
            setUser(res.data);
        } catch (err) {
            console.error("Failed to fetch user", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    const logout = async () => {
        try {
            // invalidating refresh token on server side
            await api.post("/api/auth/logout");
        } catch (error) {
            console.error("Server logout failed", error);
            // Continue with local logout even if server call fails
        } finally {
            // Clear user state and tokens
            setUser(null);
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");

            router.replace("/login");
        }
    };

    return (
        <UserContext.Provider value={{ user, loading, logout, refreshUser: fetchUser }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
};
