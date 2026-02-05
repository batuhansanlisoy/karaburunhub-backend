import { Organization as OrganizationEntity } from "../Entity/Organization";

export class Organization {
    static toResponse(org_data: OrganizationEntity) {
        return {
            ...org_data,
            content: typeof org_data.content === "string" ? JSON.parse(org_data.content) : org_data.content,
            gallery: typeof org_data.gallery === "string" ? JSON.parse(org_data.gallery) : org_data.gallery,
        };
    }

    static toListResponse(org_data: OrganizationEntity[]) {
        return org_data.map(b => Organization.toResponse(b));
    }
}
