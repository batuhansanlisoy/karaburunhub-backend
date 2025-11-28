import { ActivityRepository } from "../Repository/Activity";
import { Activity } from "../Entity/Activity";

export class ActivityService {
    private repo = new ActivityRepository();

    async list(village_id?: number, category_id?: number): Promise<Activity[]> {
        
        return this.repo.getAll(village_id, category_id);
    }

    async create(activity: Partial<Activity>): Promise<void> {
        await this.repo.create(activity);
    }

    async del(id: number): Promise<void> {
        await this.repo.del(id);
    }
}
