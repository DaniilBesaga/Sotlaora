export interface ProDTO {
    id: string;
    email: string;
    userName: string;
    role: string;
    createdAt: Date;
    location?: string;
    isOnline: boolean;
    lastSeen?: Date;
    subcategories: any[];
    orders: any[];
}