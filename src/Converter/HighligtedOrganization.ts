import { HighlightedOrganization as Entity } from "../Entity/HighlightedOrganization";
import { Organization } from "./Organization"

export class HighlightedOrganization {
    static toResponse(data: Entity) {
        return {
            ...data,
            organization: (data.organization != null && typeof data.organization === 'object') 
                ? Organization.toResponse(data.organization) 
                : null
        };
    }

    static toListResponse(data: Entity[]) {
        return data.map(b => HighlightedOrganization.toResponse(b));
    }
}
