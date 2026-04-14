export interface RequestBusiness {
    id: number,
    sender: Sender,
    business: Business,
    package: string,
    status: "pending" | "approved" | "rejected",
    is_read: boolean,
    created_at: string;
    updated_at: string;
}

interface Sender {
    name: string,
    last_name: string,
    email: string,
    phone: string
}

interface Business {
    name: string,
    email?: string
    phone?: string,
    address?: string,
    description?: string
}