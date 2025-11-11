export interface Place {
    id: number,
    village_id: number,
    name: string,
    content?: Content,
    logo_url?: string,
    gallery?: string[],
    address: string,
    latitude?: number | null;
    longitude?: number | null;
}

export interface Content {
    explanation?: string,
    detail?: string
}