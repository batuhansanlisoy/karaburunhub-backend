export interface Category {
    id: number,
    name: string,
    extra: Extra, 
    created_at: string,
    updated_at: string,
}

export interface Extra {
    icon: string,
    icon_color: string
}