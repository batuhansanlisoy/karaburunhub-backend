import { FeaturedOrganization as FeaturedOrganizationEntity } from "../Entity/FeaturedOrganization";
import { Organization } from "../Converter/Organization"

export class FeaturedOrganization {
    static toResponse(data: FeaturedOrganizationEntity) {
        return {
            ...data,
            // "" yerine null döndürüyoruz
            organization: (data.organization != null && typeof data.organization === 'object') 
                ? Organization.toResponse(data.organization) 
                : null
        };
    }

    static toListResponse(data: FeaturedOrganizationEntity[]) {
        return data.map(b => FeaturedOrganization.toResponse(b));
    }
}
