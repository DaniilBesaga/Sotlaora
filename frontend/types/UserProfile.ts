export interface UserProfile {
    id: number;
    phoneNumber: string;
    city: string;
    address: string;
    dateOfBirth: string;
    gender: Gender;
    bio: string;
    location: {
        type: string;
        coordinates: [number, number];
    } | null;
    userId: number;
}

export enum Gender {
    Male = "Male",
    Female = "Female",
    Unspecified = "Unspecified"
}

export interface UserProfileDTO {
    city?: string;
    phoneNumber?: string;
    dateOfBirth?: string;
    gender?: Gender;
    bio?: string;
}