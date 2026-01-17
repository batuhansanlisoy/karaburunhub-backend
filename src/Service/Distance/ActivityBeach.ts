import { DistanceActivityBeach } from "../../Entity/Distance/ActivityBeach";
import { DistanceActivityBeachRepo } from "../../Repository/Distance/ActivityBeach";

export class DistanceActivityBeachService {
    private repo = new DistanceActivityBeachRepo();

    async create(payload: Partial<DistanceActivityBeach>): Promise<number[]> {

        return await this.repo.create(payload);
    }
}
