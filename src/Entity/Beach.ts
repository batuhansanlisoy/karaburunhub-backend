export interface Beach {
    id: number,
    village_id: number,
    name: string,
    extra?: Extra,
    cover?: Cover,
    gallery?: string[],
    address: string,
    latitude?: number | null,
    longitude?: number | null,
    created_at: string,
    updated_at: string,
    village_name?: string,
}

export interface Extra {
    explanation?: string,
    detail?: string,
}

export interface Cover {
    url: string,
    filename: string
    path: string
}