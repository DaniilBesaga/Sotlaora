'use client';
import { use, useEffect, useState } from "react";
import { ChatShortDTO } from "@/types/Chat";
import ChatsList from "../../components/ui/cabinet/ChatList";
import { LoginContext } from "../../components/context/LoginContext";

export default function Messages() {
    const [chats, setChats] = useState<ChatShortDTO[]>([]);
    const {authorizedFetch} = use(LoginContext)
    useEffect(() => {
        const fetchChats = async () => {
            const res = await authorizedFetch(`http://localhost:5221/api/chat/chatsPro`, {
                method: 'GET',
                
            });
            const chats = await res.json();
            setChats(chats);
        }
        fetchChats();
    }, []);
    
    

    return(
        <ChatsList chats={chats}/>
    )
}