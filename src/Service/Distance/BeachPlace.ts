import { DistanceBeachPlace } from "../../Entity/Distance/BeachPlace";
import { DistanceBeachPlaceRepo } from "../../Repository/Distance/BeachPlace";

export class DistanceBeachPlaceService {
    private repo = new DistanceBeachPlaceRepo();

    async list(beach_id?: number, place_id?: number): Promise<DistanceBeachPlace[]> {
        return await this.repo.list(beach_id, place_id);
    }

    async create(payload: Partial<DistanceBeachPlace>): Promise<void> {

        await this.repo.create(payload);
    }
}
