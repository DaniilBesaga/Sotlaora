'use client'
import { use, useEffect, useState } from "react";
import ChatsClient from "./ChatsClient";
import { LoginContext } from "../../components/context/LoginContext";
import { ChatShortDTO } from "@/types/Chat";

export default  function Chats(){
    const {authorizedFetch} = use(LoginContext)

    const [chats, setChats] = useState<ChatShortDTO[]>([]);

    useEffect(() => {
        const fetchChats = async () => {
            const res = await authorizedFetch(`http://localhost:5221/api/chat/chatsClient`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                "credentials": "include",
            });
            const chats = await res.json();
            return chats;
        }
        fetchChats().then((data) => {
            setChats(data);
        });
    }, []);

    return(
        <ChatsClient chats={chats} />
    )
}