import { DistanceBeachOrganization } from "../../Entity/Distance/BeachOrganization";
import { DistanceBeachOrganizationRepo } from "../../Repository/Distance/BeachOrganization";

export class DistanceBeachOrganizationService {
    private repo = new DistanceBeachOrganizationRepo();

    async create(payload: Partial<DistanceBeachOrganization>): Promise<void> {

        await this.repo.create(payload);
    }
}
