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
    Male = 0,
    Female = 1,
    Unspecified = 2
}

export interface UserProfileDTO {
    city?: string;
    phoneNumber?: string;
    dateOfBirth?: string;
    gender?: Gender;
    bio?: string;
}