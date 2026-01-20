import { DistanceActivityOrganization } from "../../Entity/Distance/ActivityOrganization";
import { DistanceActivityOrganizationRepo } from "../../Repository/Distance/ActivityOrganization";

export class DistanceActivityOrganizationService {
    private repo = new DistanceActivityOrganizationRepo();

    async list(activity_id?: number, organization_id?: number): Promise<DistanceActivityOrganization[]> {
        return await this.repo.list(activity_id, organization_id);
    }

    async create(payload: Partial<DistanceActivityOrganization>): Promise<void> {

        await this.repo.create(payload);
    }
}
