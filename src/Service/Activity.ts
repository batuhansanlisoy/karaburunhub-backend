import db from "../db/knex";
import { FileService } from "./File";
import { Activity } from "../Entity/Activity";
import { ActivityRepository } from "../Repository/Activity";
import { BeachService } from "../Service/Beach";
import { getDistance  } from "../shared/geo/distance";
import { DistanceActivityBeachService } from "./Distance/ActivityBeach";

export class ActivityService {
    private repo = new ActivityRepository();
    private beachService = new BeachService();
    private activityBeachDistanceService = new DistanceActivityBeachService();

    async single(id: number): Promise<Activity> {
        return this.repo.single(id);
    }

    async list(village_id?: number, category_id?: number): Promise<Activity[]> {
        
        return this.repo.getAll(village_id, category_id);
    }

    async create(activity: Partial<Activity>): Promise<number[]> {
        
        const activityIds = await this.repo.create(activity);
        const activityId = activityIds[0];

        if (activity.latitude != null && activity.longitude != null) {

            await this.calculateBeachDistance(activityId, activity as Activity);
        }

        return activityIds;
    }

    async calculateBeachDistance(activity_id: number, activity: Activity) {
        const beachs = await this.beachService.list();

        for (const beach of beachs) {
            if (beach.latitude != null && beach.longitude != null) {
                const distance = getDistance(
                    activity.latitude!,
                    activity.longitude!,
                    beach.latitude!,
                    beach.longitude!
                );

                await this.activityBeachDistanceService.create({
                    activity_id: activity_id,
                    beach_id: beach.id,
                    distance_meter: Math.round(distance.meters)
                });
            }
        }
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
