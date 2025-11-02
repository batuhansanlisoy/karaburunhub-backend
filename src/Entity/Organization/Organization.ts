export interface Organization{
    id: number,
    category_id: number,
    name: string,
    email: string,
    phone: string,
    content?: string,
    website?: string,
    logo_url?: string,
    gallery?: string[],
    address: string,
    latitude?: number,
    longitude?: number,
    created_at: string,
    updated_at?: string,
}

export interface Content {
    explanation?: string,
    detail?: string
}
