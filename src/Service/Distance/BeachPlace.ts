import { DistanceBeachPlace } from "../../Entity/Distance/BeachPlace";
import { DistanceBeachPlaceRepo } from "../../Repository/Distance/BeachPlace";

export class DistanceBeachPlaceService {
    private repo = new DistanceBeachPlaceRepo();

    async create(payload: Partial<DistanceBeachPlace>): Promise<void> {

        await this.repo.create(payload);
    }
}
