import { ClientDTO } from "./Client";
import { SubcategoryDTO } from "./ServicePrices";

export enum OrderStatus {
  Draft = "Draft",
  Active = "Active", // not taken yet
  Assigned = "Assigned", // assigned to specific pro
  Disscussion = "Discussion", // in discussion with pro
  InProgress = "InProgress", // taken by pro
  Completed = "Completed",
  Paid = "Paid",
  WaitingForConfirmationByClient = "WaitingForConfirmationByClient",
  CancelledByClient = "CancelledByClient",
  CancelledByPro = "CancelledByPro",
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
  id: number;
  
  title: string;
  description: string;

  postedAt: Date;
  price: number;

  location: Location;

  additionalComment: string;

  deadlineDate?: Date;

  desiredTimeStart?: string; // TimeOnly from C# - format: "HH:mm:ss"
  desiredTimeEnd?: string;   // TimeOnly from C# - format: "HH:mm:ss"

  subcategories: number[];

  imageFileRefs: string[];
  imageFileIds: number[];

  status: OrderStatus;

  clientId: number;
  proId: number;
}

export interface ProCard {
  id: number;
  proId: number;
  userName: string;
  description: string;
  imageRef: string;
  subcategoriesDTO: SubcategoryDTO[];
  location: string;
  price?: number;
  rating: number;
  reviewsCount: number;
}

export interface OrderFullDTO {
  id: number;
  title: string;
  description: string;
  postedAt: Date | string;
  price: number;
  location: Location;
  address: string;
  distance: number;
  additionalComment: string;
  deadlineDate?: Date | string | null;
  desiredTimeStart?: string | null;
  desiredTimeEnd?: string | null;
  subcategoriesDTO: SubcategoryDTO[];
  imageFileRefs: string[];
  client: ClientDTO;
  status: OrderStatus;
}