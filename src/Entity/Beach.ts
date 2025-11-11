export interface Beach {
    id: number;
    village_id: number;
    name: string;
    extra?: Extra;
    logo_url?: string;
    gallery?: string[];
    address: string;
    latitude?: number | null;
    longitude?: number | null;
    created_at: string;
    updated_at: string;
    village_name?: string;
}

export interface Extra {
    explanation?: string;
    detail?: string;
}