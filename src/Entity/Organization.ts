export interface Organization{
    id: number,
    category_id: number,
    name: string,
    email?: string,
    phone?: string,
    content?: string,
    website?: string,
    cover?: Cover,
    gallery?: string[];
    address: string,
    latitude?: number | null;
    longitude?: number | null;
    created_at: string,
    updated_at?: string,
}

export interface Content {
    explanation?: string,
    detail?: string
}

export interface Cover {
    url: string,
    filename: string
    path: string
}
