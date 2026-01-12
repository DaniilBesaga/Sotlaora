import { Gender } from "./UserProfile";
import { SubcategoryDTOWithDesc } from "./Category";
import { SubcategoryDTO } from "./ServicePrices";

export interface ProDTO {
    id: string;
    email: string;
    userName: string;
    role: string;
    createdAt: Date;
    location?: string;
    isOnline: boolean;
    lastSeen?: Date;
    proSubcategories: SubcategoryDTO[];
    orders: any[];
    imageRef?: string;
    phoneNumber?: string;
}

export interface ProPublicProfile extends ProDTO {
    reviews: any[];
    reviewsCount: number;
    rating: number;
    bio: string;
    price?: number;
    completedOrdersCount: number;
}

export interface ProProfileDTO {
    phoneNumber: string;
    city: string;
    dateOfBirth?: string;
    gender: Gender;
    bio: string;
    subcategoryDTOs: SubcategoryDTOWithDesc[];
    totalCount: number;
    filledSubcategoriesCount: number;
}

export interface ProCardDTO {
    id: number;
    proId: number;
    userName: string;
    description: string;
    imageRef: string;
    subcategoriesDTO: SubcategoryDTOWithDesc[];
    location: string;
    price?: number;
    rating: number;
    reviewsCount: number;
    verifiedIdentity: boolean;
}