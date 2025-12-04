import { Role } from "@/types/Role";
import { createContext, useEffect, useState } from "react";

interface UserDTO {
    Id: number;
    Email: string;
    UserName: string;
    Role: Role;
    ImageRef?: string;
}

type AuthState = "loading" | "authenticated" | "unauthenticated";

const EmptyUser: UserDTO = {
    Id: -1,
    Email: "",
    UserName: "",
    Role: Role.Client,
    ImageRef: undefined
};

type LoginContextType = {
  user: UserDTO;
  authenticated: AuthState;
  getMe: () => Promise<{ ok: boolean; status: number }>;
  logout: () => Promise<void>;
  refresh: () => Promise<number>;
};

const LoginContext = createContext<LoginContextType>({user: EmptyUser, authenticated: "loading", getMe: async () => ({ ok: false, status: 0 }), logout: async () => {}, refresh: async () => 0});

const LoginProvider = ({children}: {children: React.ReactNode}) =>{
    const [user, setUser] = useState<UserDTO>(EmptyUser);
    const [authenticated, setAuthenticated] = useState<AuthState>("loading");

    useEffect(() => {
        getMe()
    }, [])

    const getMe = async () => {
        try {
            const res = await fetch("http://localhost:5221/api/auth/meShort", {
                method: "GET",
                credentials: "include",
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!res.ok) {
                if (res.status === 401) {
                    setUser(EmptyUser);
                    setAuthenticated("unauthenticated");
                    return { ok: false, status: 401 };
                }
                throw new Error(`HTTP error! status: ${res.status}`);
            }

            const data = await res.json();
            
            if (data && data.Id && data.Email && data.UserName) {
                setUser(data);
                setAuthenticated("authenticated");
            } else {
                setUser(EmptyUser);
                setAuthenticated("unauthenticated");
                return { ok: false, status: 401 };
            }
        } catch (error) {
            console.error("Authentication failed:", error);
            setUser(EmptyUser);
            setAuthenticated("unauthenticated");
            return { ok: false, status: 401 };
        }
        return { ok: true, status: 200 };
    }

    const logout = async () => {
        await fetch("http://localhost:5221/api/auth/logout", {
            method: "POST",
            credentials: "include",
        });
        setUser(EmptyUser);
        setAuthenticated("unauthenticated");
    }

    const refresh = async () => {
        const res = await fetch("http://localhost:5221/api/auth/refresh", {
            method: "POST",
            credentials: "include",
        });
        return res.status;
    }

    return <LoginContext.Provider value={{user, authenticated, getMe, logout, refresh}}>{children}</LoginContext.Provider>
}

export {LoginContext, LoginProvider};