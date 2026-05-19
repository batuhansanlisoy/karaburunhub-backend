export interface LocalProducer{
    id: number,
    name: string,
    email?: string,
    phone: string,
    title: string,
    extra?: Extra,
    village_id: number,
    address: string,
    is_active: boolean,
    highlight: boolean,
    cover?: Cover,
    gallery?: string[];
    video_urls?: string[],
    created_at: string,
    updated_at?: string,
}

interface Extra {
    products?: string[]
}

interface Cover {
    url: string,
    filename: string
    path: string
}
