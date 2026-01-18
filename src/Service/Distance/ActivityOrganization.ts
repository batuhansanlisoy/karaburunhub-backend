import { DistanceActivityOrganization } from "../../Entity/Distance/ActivityOrganization";
import { DistanceActivityOrganizationRepo } from "../../Repository/Distance/ActivityOrganization";

export class DistanceActivityOrganizationService {
    private repo = new DistanceActivityOrganizationRepo();

    async create(payload: Partial<DistanceActivityOrganization>): Promise<number[]> {

        return await this.repo.create(payload);
    }
}
