import { DistanceActivityPlace } from "../../Entity/Distance/ActivityPlace";
import { DistanceActivityPlaceRepo } from "../../Repository/Distance/ActivityPlace";

export class DistanceActivityPlaceService {
    private repo = new DistanceActivityPlaceRepo();

    async list(activity_id?: number, place_id?: number): Promise<DistanceActivityPlace[]> {
        return await this.repo.list(activity_id, place_id);
    }

    async create(payload: Partial<DistanceActivityPlace>): Promise<void> {

        await this.repo.create(payload);
    }
}
