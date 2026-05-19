import { Subcategory } from "./Organization/Subcategory";

export interface Organization{
    id: number,
    village_id: number,
    category_id: number,
    name: string,
    email?: string,
    phone?: string,
    content?: Content,
    website?: string,
    cover?: Cover,
    gallery?: string[];
    video_urls?: string[],
    higlight: boolean,
    is_active: boolean,
    address: string,
    latitude?: number | null;
    longitude?: number | null;
    created_at: string,
    updated_at?: string,
    sub_categories?: Subcategory[];
}

export interface Content {
    description?: string,
    has_delivery?: boolean,
    has_wifi?: boolean,
    payment_methods?: string[]
}

export interface Cover {
    url: string,
    filename: string
    path: string
}
