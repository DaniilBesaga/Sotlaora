export interface NotificationDTO {
  title: string;
  message: string;
  type: NotificationType;
}

export enum NotificationType {
    System = 0,
    Assigned = 1,
    NewOrder = 2,
    Completed = 3,
    Urgent = 4,
    SetupRequired = 5
}