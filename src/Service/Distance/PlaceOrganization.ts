import { DistancePlaceOrganization } from "../../Entity/Distance/PlaceOrganization";
import { DistancePlaceOrganizationRepo } from "../../Repository/Distance/PlaceOrganization";

export class DistancePlaceOrganizationService {
    private repo = new DistancePlaceOrganizationRepo();

    async list(organization_id?: number, place_id?: number): Promise<DistancePlaceOrganization[]> {
        return await this.repo.list(organization_id, place_id);
    }

    async create(payload: Partial<DistancePlaceOrganization>): Promise<void> {

        await this.repo.create(payload);
    }
}
