export interface ExploreFeed{
    id: number,
    item_type: string,
    item_id: number,
    title: string,
    video_url: string,
    score: number,
    is_active: boolean
    created_at: string,
    updated_at?: string,
}