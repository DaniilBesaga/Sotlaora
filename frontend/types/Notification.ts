export interface NotificationDTO {
  title: string;
  message: string;
  type: NotificationType;
  slug: string;
}

export enum NotificationType {
    System = 0,
    Assigned = 1,
    NewOrder = 2,
    Completed = 3,
    Urgent = 4,
    SetupRequired = 5
}

export interface Notification {
  id: number;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: string;
  slug: string;
  userId: number;
  meta: NotificationMetadata;
}

export interface NotificationMetadata {
  orderId?: number;
  clientName?: string;
  category?: string;
  amount?: string;
}