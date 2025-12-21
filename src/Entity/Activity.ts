export interface Activity {
    id: number,
    category_id: number,
    village_id: number,
    name: string,
    content?: Content | string,
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
    explanation?: string,
    timeline?: DayTimeline[]
}

export interface Cover {
    url: string,
    filename: string,
    path: string
}

// Gün bazlı timeline
export interface DayTimeline {
    date: string,
    events: TimeLine[]
}

export interface TimeLine {
    time: string,
    title: string
}
