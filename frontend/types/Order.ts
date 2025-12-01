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

  postedAt: Date;
  price: number;

  location: Location;
  address: string | "";

  distance: number | 0;
  additionalComment: string | "";

  responsesCount: number | 0;

  deadlineDate?: string | Date;

  desiredTimeStart?: string | null; 
  desiredTimeEnd?: string | null; 

  status: OrderStatus;

  subcategories: number[];

  files: File[];

  clientId: number;

  proId: number;
}

export interface OrderDTO {
  
  title: string | "";
  description: string | "";

  postedAt: Date;
  price: number;

  location: Location;

  additionalComment: string | "";

  deadlineDate?: string | Date;

  desiredTimeStart?: string; 
  desiredTimeEnd?: string;   

  subcategories: number[];

  clientId: number;
}