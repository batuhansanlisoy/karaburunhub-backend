import { HighlightedOrganization } from "../Entity/HighlightedOrganization";
import { HighlightedOrganizationRepository } from "../Repository/HighlightedOrganization";

export class HighlightedOrganizationService {
    private repo = new HighlightedOrganizationRepository();
    
    async list(orgId?: number, orgInfo: boolean = false): Promise<HighlightedOrganization[]> {
        return this.repo.getAll(orgId, orgInfo);
    }

    async create(payload: Partial<HighlightedOrganization>): Promise<number[]> {

        return await this.repo.create(payload);
    }
}
