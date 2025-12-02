export interface Activity {
    id: number,
    category_id: number,
    village_id: number,
    name: string,
    content?: Content,
    cover?: Cover,
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

export interface Cover {
    url: string,
    filename: string
    path: string
}