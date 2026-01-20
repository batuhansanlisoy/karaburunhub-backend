import { DistanceActivityBeach } from "../../Entity/Distance/ActivityBeach";
import { DistanceActivityBeachRepo } from "../../Repository/Distance/ActivityBeach";

export class DistanceActivityBeachService {
    private repo = new DistanceActivityBeachRepo();

    async list(activity_id?: number, beach_id?: number): Promise<DistanceActivityBeach[]> {
        return await this.repo.list(activity_id, beach_id);
    }

    async create(payload: Partial<DistanceActivityBeach>): Promise<void> {

        await this.repo.create(payload);
    }
}
