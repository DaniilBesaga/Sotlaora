import { Subcategory } from "@/types/Category";
import { Role } from "@/types/Role";
import { createContext, useEffect, useState } from "react";

interface UserDTO {
    id: number;
    email: string;
    userName: string;
    role: Role;
    imageRef?: string;
}

interface UserDTOLong extends UserDTO {
    createdAt: string;
    location?: string;
    isOnline: boolean;
    lastSeen?: string;
    prosubcategories: Subcategory[];
    orders: number[];
}

type AuthState = "loading" | "authenticated" | "unauthenticated";

const EmptyUser: UserDTO = {
    id: -1,
    email: "",
    userName: "",
    role: Role.Client,
    imageRef: undefined
};

const EmptyUserLong: UserDTOLong = {
    id: -1,
    email: "",
    userName: "",
    role: Role.Client,
    imageRef: undefined,
    createdAt: "",
    location: undefined,
    isOnline: false,
    lastSeen: undefined,
    prosubcategories: [],
    orders: []
};

type LoginContextType = {
  user: UserDTO;
  userLong?: UserDTOLong;
  authenticated: AuthState;
  getMe: (retry: boolean) => Promise<{ ok: boolean; status: number }>;
  getMeLong?: (retry: boolean) => Promise<{ ok: boolean; status: number }>;
  logout: () => Promise<void>;
  refresh: () => Promise<number>;
};

const LoginContext = createContext<LoginContextType>({user: EmptyUser, userLong: EmptyUserLong, authenticated: "loading",  getMe: async () => ({ ok: false, status: 0 }), getMeLong: async () => ({ ok: false, status: 0 }), logout: async () => {}, refresh: async () => 0});

const LoginProvider = ({children}: {children: React.ReactNode}) =>{
    const [user, setUser] = useState<UserDTO>(EmptyUser);
    const [userLong, setUserLong] = useState<UserDTOLong>(EmptyUserLong);
    const [authenticated, setAuthenticated] = useState<AuthState>("loading");

    useEffect(() => {
        getMe()
    }, [])

    const getMe = async (retry = false) => {
        try {
            const res = await fetch("http://localhost:5221/api/auth/meShort", {
                method: "GET",
                credentials: "include",
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (res.ok) {
                const data = await res.json();
                console.log(data)
                if (data?.id && data?.email) {
                    setUser(data);
                    setAuthenticated("authenticated");
                    return { ok: true, status: res.status };
                }
            }

            if(res.status === 401 && !retry){
                const refreshStatus = await refresh();
                if(refreshStatus === 200){
                    return await getMe(true);
                }
            }

            setUser(EmptyUser);
            setAuthenticated("unauthenticated");
            return { ok: false, status: 401 };

        } catch (error) {
            console.error("Authentication failed:", error);
            setUser(EmptyUser);
            setAuthenticated("unauthenticated");
            return { ok: false, status: 401 };
        }
    }

    const getMeLong = async (retry = false) => {
        try {
            const res = await fetch("http://localhost:5221/api/auth/meLong", {
                method: "GET",
                credentials: "include",
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (res.ok) {
                const data = await res.json();
                if (data?.id && data?.email) {
                    setUserLong(data);
                    setAuthenticated("authenticated");
                    return { ok: true, status: res.status };
                }
            }

            if(res.status === 401 && !retry){
                const refreshStatus = await refresh();
                if(refreshStatus === 200){
                    return await getMeLong(true);
                }
            }

            setUserLong(EmptyUserLong);
            setAuthenticated("unauthenticated");
            return { ok: false, status: 401 };

        } catch (error) {
            console.error("Authentication failed:", error);
            setUserLong(EmptyUserLong);
            setAuthenticated("unauthenticated");
            return { ok: false, status: 401 };
        }
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

    return <LoginContext.Provider value={{user, userLong, authenticated, getMe, getMeLong, logout, refresh}}>{children}</LoginContext.Provider>
}

export {LoginContext, LoginProvider};