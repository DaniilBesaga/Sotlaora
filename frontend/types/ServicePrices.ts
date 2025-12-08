export enum PriceType {
    PerHour = 1,   
    PerPiece = 2,  
    PerVisit = 3 
}

export interface SubcategoryDTO {
    id: number;
    title: string;
    slug: string;
}

export interface ServicePricesDTO {
    price: number;
    priceType: PriceType;
    subcategoryDTO: SubcategoryDTO;
}

export interface ServicePricesWithCategory {
    categoryTitle: string;
    servicePrices: ServicePricesDTO[];
}