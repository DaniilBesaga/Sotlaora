import { OrderDTO } from "./Order";

export interface ClientDTO {
  id: number;
  email: string;
  userName: string;
  role: string;
  createdAt: Date | string;
  location?: string | null;
  isOnline: boolean;
  lastSeen?: Date | string | null;
  imageRef?: string | null;
  phoneNumber?: string | null;
  orders: OrderDTO[];
}
