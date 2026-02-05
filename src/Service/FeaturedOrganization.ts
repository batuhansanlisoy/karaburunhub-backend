import { FeaturedOrganization } from "../Entity/FeaturedOrganization";
import { FeaturedOrganizationRepository } from "../Repository/FeaturedOrganization";

export class FeaturedOrganizationService {
    private repo = new FeaturedOrganizationRepository();
    
    async list(orgId?: number, orgInfo: boolean = false): Promise<FeaturedOrganization[]> {
        return this.repo.getAll(orgId, orgInfo);
    }

    async create(payload: Partial<FeaturedOrganization>): Promise<number[]> {

        return await this.repo.create(payload);
    }
}
