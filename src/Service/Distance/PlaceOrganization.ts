import { DistancePlaceOrganization } from "../../Entity/Distance/PlaceOrganization";
import { DistancePlaceOrganizationRepo } from "../../Repository/Distance/PlaceOrganization";

export class DistancePlaceOrganizationService {
    private repo = new DistancePlaceOrganizationRepo();

    async create(payload: Partial<DistancePlaceOrganization>): Promise<void> {

        await this.repo.create(payload);
    }
}
