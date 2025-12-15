import { Order } from "./Order";

export interface Message {
    id: number;
    content: string;
    timestamp: string;
    senderId: number;
    receiverId: number;
    isRead: boolean;
    chatId: string;
}

export interface ChatShortDTO {
    id: string;
    clientName: string;
    avatar: string;
    orderId: number;
    orderTitle: string;
    lastMessage: string;
    time: string;
    unread: boolean;
}

export interface ChatInfoDTO {
    clientId: number;
    proId: number;
}

export interface Chat {
    id: string;
    createdAt: string;
    updatedAt: string | null;
    messages: Message[];
    clientId: number;
    clientName: string;
    avatar: string;
    proId: number;
    orderId: number;
    order: Order;
}