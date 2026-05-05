export interface Notification{
    id: number,
    title: string,
    message: string,
    is_active: boolean,
    created_at: string,
    updated_at?: string,
}