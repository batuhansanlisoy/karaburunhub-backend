export interface Event {
    id: number,
    village_id: number,
    name: string,
    content?: Content,
    logo_url?: string,
    gallery?: string[],
    address: string,
    latitude?: number | null,
    longitude?: number | null,
    begin?: string,
    end?: string,
    created_at: string,
    updated_at?: string,
}

export interface Content {
    explanation?: string
}