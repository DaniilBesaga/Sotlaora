'use client'
import { useRouter } from "next/navigation";
import React, { useEffect, useState, createContext, useContext } from "react";

interface UserDTO {
    username: string;
    email: string;
    profilePicture: string;
}

type AuthState = "loading" | "authenticated" | "unauthenticated";

interface AuthContextType {
    user: UserDTO | null;
    authState: AuthState;
    login: (accessToken: string) => void;
    logout: () => void;
    fetchWithAuth: (url: string, options?: RequestInit) => Promise<Response>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export default function AuthProvider({ children }: { children: React.ReactNode }) {

    const [user, setUser] = useState<UserDTO | null>(null);
    const [authState, setAuthState] = useState<AuthState>("loading");
    const router = useRouter();

    const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
        let accessToken = localStorage.getItem("accessToken");

        let res = await fetch(url, {
            ...options,
            headers: {
                ...options.headers,
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            credentials: "include",
        });

        if (res.status === 401) {
            console.log("refresh")
            const refreshRes = await fetch("http://localhost:5221/api/auth/refresh", {
                method: "POST",
                credentials: "include",
            });

            if (!refreshRes.ok) {
                setAuthState("unauthenticated");
                return res;
            }

            const refreshData = await refreshRes.json();
            accessToken = refreshData.newAccessToken;
            localStorage.setItem("accessToken", accessToken || "noAccess");

            res = await fetch(url, {
                ...options,
                headers: {
                    ...options.headers,
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
                credentials: "include",
            });
        }

        return res;
    };

    const login = async (accessToken: string) => {
        const res = await fetch("http://localhost:5221/api/auth/meShort", {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            credentials: "include",
        });
        const userData = await res.json()
        localStorage.setItem("accessToken", accessToken);
        setUser(userData);
        setAuthState("authenticated");
    };

    const logout = async () => {
        await fetch("http://localhost:5221/api/account/logout", {
            method: "POST",
            credentials: "include",
        });
        localStorage.removeItem("accessToken");
        setUser(null);
        setAuthState("unauthenticated");
        router.push("/login");
    };

    useEffect(() => {
        const initUser = async () => {
            try {
                const res = await fetchWithAuth("http://localhost:5221/api/auth/meShort");
                if (res.ok) {
                    const data = await res.json();
                    setUser(data);
                    setAuthState("authenticated");
                } else {
                    setAuthState("unauthenticated");
                }
            } catch (err) {
                setAuthState("unauthenticated");
            }
        };

        initUser();
    }, []);

    return (
        <AuthContext.Provider value={{ user, authState, login, logout, fetchWithAuth }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within AuthProvider");
    return context;
};
