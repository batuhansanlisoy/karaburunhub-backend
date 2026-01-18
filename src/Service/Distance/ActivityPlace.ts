import { DistanceActivityPlace } from "../../Entity/Distance/ActivityPlace";
import { DistanceActivityPlaceRepo } from "../../Repository/Distance/ActivityPlace";

export class DistanceActivityPlaceService {
    private repo = new DistanceActivityPlaceRepo();

    async create(payload: Partial<DistanceActivityPlace>): Promise<number[]> {

        return await this.repo.create(payload);
    }
}
