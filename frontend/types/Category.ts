
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