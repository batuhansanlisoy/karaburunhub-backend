export interface Beach {
    id: number;
    village_id: number;
    content?: Content;
    url?: string;
    created_at: string;
    updated_at: string;
    village_name?: string;
}

export interface Content {
    title: string;
    subtitle?: string;
    address: string;
}