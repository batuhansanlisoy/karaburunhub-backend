export interface Place {
    id: number,
    village_id: number,
    name: string,
    content?: Content,
    cover?: Cover,
    gallery?: string[],
    address: string,
    latitude?: number | null;
    longitude?: number | null;
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