import { DistanceBeachOrganization } from "../../Entity/Distance/BeachOrganization";
import { DistanceBeachOrganizationRepo } from "../../Repository/Distance/BeachOrganization";

export class DistanceBeachOrganizationService {
    private repo = new DistanceBeachOrganizationRepo();

    async list(beach_id?: number, organization_id?: number): Promise<DistanceBeachOrganization[]> {
        return await this.repo.list(beach_id, organization_id);
    }

    async create(payload: Partial<DistanceBeachOrganization>): Promise<void> {

        await this.repo.create(payload);
    }
}
