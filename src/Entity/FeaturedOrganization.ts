import { Organization } from "./Organization";

export interface FeaturedOrganization{
    id: number,
    organization_id: number,
    active?: boolean,
    created_at: string,
    updated_at?: string,
    organization?: Organization
}