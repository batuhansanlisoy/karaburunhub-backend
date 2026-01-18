import db from "../db/knex";
import { FileService } from "./File";
import { Activity } from "../Entity/Activity";
import { ActivityRepository } from "../Repository/Activity";
import { LocationDistanceOrchestrator } from "./Distance";

export class ActivityService {
    private repo = new ActivityRepository();
    private distanceService = new LocationDistanceOrchestrator

    async single(id: number): Promise<Activity> {
        return this.repo.single(id);
    }

    async list(village_id?: number, category_id?: number): Promise<Activity[]> {
        
        return this.repo.getAll(village_id, category_id);
    }

    async create(activity: Partial<Activity>): Promise<number[]> {
        
        const activityIds = await this.repo.create(activity);
        const activityId = activityIds[0];

        if (activity.latitude != null || activity.longitude !== null) {

            this.distanceService.onActivityCreated(activityId, activity.latitude!, activity.longitude!);
        }
        
        return activityIds;
    }

    async update(id: number, activity: Partial<Activity>): Promise<void> {
        await this.repo.update(id, activity);
    }

    async del(id: number): Promise<void> {

        await db.transaction(async (trx) => {
            const activity = await this.repo.single(id);

            if (!activity) {
                throw new Error("Activity bulunamadı");
            }

            await this.repo.del(id, trx);
        });

        try {
            FileService.deleteFolder(`upload/activity/${id}`);
        } catch (error) {
            console.error("Dosya silme hatası:", error);
        }
    }
}
