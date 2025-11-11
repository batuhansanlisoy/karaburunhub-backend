import { ActivityRepository } from "../Repository/Activity";
import { Activity } from "../Entity/Activity";

export class ActivityService {
    private repo = new ActivityRepository();

    async list(village_id?: number): Promise<Activity[]> {
        if (village_id) {
            return this.repo.getByVillageId(village_id);
        }

        return this.repo.getAll();
    }

    async create(activity: Partial<Activity>): Promise<void> {
        await this.repo.create(activity);
    }

    async del(id: number): Promise<void> {
        await this.repo.del(id);
    }
}
