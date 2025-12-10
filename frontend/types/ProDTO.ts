import { Gender } from "./UserProfile";
import { SubcategoryDTOWithDesc } from "./Category";

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
    imageRef?: string;
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