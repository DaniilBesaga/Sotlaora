export enum OrderStatus {
  Active = "Active",
  Taken = "Taken",
  Completed = "Completed",
  Cancelled = "Cancelled",
  WaitingForPayment = "WaitingForPayment",
  UnderReview = "UnderReview",
}

export enum Location {
  AtClients = "AtClients",
  AtPros = "AtPros",
  Online = "Online",
}

export interface Subcategory {
  id: number;
}

export interface Order {

  title: string | "";
  description: string | "";

  postedAt: string | Date;
  price: number;

  location: Location;
  address: string | "";

  distance: number | 0;
  additionalComment: string | "";

  responsesCount: number | 0;

  deadlineDate?: string | Date | null;

  desiredTimeStart?: string | null; // "HH:mm"
  desiredTimeEnd?: string | null;   // "HH:mm"

  status: OrderStatus;

  subcategories: number[];

  files: File[];

  clientId: number;

  proId: number;
}
