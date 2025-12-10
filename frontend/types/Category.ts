
export interface Category {
    id: number;
    title: string;
    slug : string;
    subcategories: Subcategory[];
}

export interface Subcategory {
    id: number;
    title: string;
    slug : string;
}

export interface SubcategoryWithCountBio {
    count: number;
    bio: string;
    subcategoryDTOs: SubcategoryWithDescription[];
}

export interface SubcategoryWithDescription {
    id: number;
    title: string;
    slug : string;
    description: string;
}

export interface SubcategoryDTOWithDesc {
    id: number;
    title: string;
    slug : string;
    description: string;
}