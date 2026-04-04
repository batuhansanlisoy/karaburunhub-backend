export interface Feedback{
    id: number,
    name?: string,
    last_name?: string,
    email?: string,
    phone?: string,
    content: Content,
    is_read: boolean,
    created_at: string,
    updated_at?: string,
}

export interface Content {
    message?: string
    category?: string
}
