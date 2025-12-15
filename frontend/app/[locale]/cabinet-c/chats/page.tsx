import ChatsClient from "./ChatsClient";

export default async function Chats(){

    const res = await fetch(`http://localhost:5221/api/chat/chatsClient`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        "credentials": "include",
    });
    const chats = await res.json();

    return(
        <ChatsClient chats={chats} />
    )
}