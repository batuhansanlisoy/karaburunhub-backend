import db from "../db/knex";
import { getDistance  } from "../shared/geo/distance";
import { FileService } from "./File";
import { Activity } from "../Entity/Activity";
import { ActivityRepository } from "../Repository/Activity";
import { BeachService } from "../Service/Beach";
import { PlaceService } from "../Service/Place";
import { OrganizationService } from "../Service/Organization/Organization";
import { DistanceActivityBeachService } from "./Distance/ActivityBeach";
import { DistanceActivityPlaceService } from "./Distance/ActivityPlace";
import { DistanceActivityOrganizationService } from "./Distance/ActivityOrganization";

export class ActivityService {
    private repo = new ActivityRepository();
    private beachService = new BeachService();
    private orgService = new OrganizationService();
    private placeService = new PlaceService();
    private activityPlaceDistanceService = new DistanceActivityPlaceService();
    private activityBeachDistanceService = new DistanceActivityBeachService();
    private activityOrganizationDistanceService = new DistanceActivityOrganizationService();

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

            await Promise.all([
                this.calculateBeachDistance(activityId, activity.latitude, activity.longitude),
                this.calculateOrganizationDistance(activityId, activity.latitude, activity.longitude),
                this.calculatePlaceDistance(activityId, activity.latitude, activity.longitude),
            ]);
        }

        return activityIds;
    }

    async calculateBeachDistance(activity_id: number, self_lat: number, self_lon: number) {
        const beachs = await this.beachService.list();

        for (const beach of beachs) {
            if (beach.latitude != null && beach.longitude != null) {
                const distance = getDistance(self_lat!, self_lon!, beach.latitude!, beach.longitude!);

                await this.activityBeachDistanceService.create({
                    activity_id: activity_id,
                    beach_id: beach.id,
                    distance_meter: Math.round(distance.meters)
                });
            }
        }
    }

    async calculateOrganizationDistance(activity_id: number, self_lat: number, self_lon: number) {
        const organizations = await this.orgService.list();

        for (const org of organizations) {
            if (org.latitude != null && org.longitude != null) {
                const distance = getDistance(self_lat!, self_lon!, org.latitude!, org.longitude!);

                await this.activityOrganizationDistanceService.create({
                    activity_id: activity_id,
                    organization_id: org.id,
                    distance_meter: Math.round(distance.meters)
                });
            }
        }
    }

    async calculatePlaceDistance(activity_id: number, self_lat: number, self_lon: number) {
        const places = await this.placeService.list();

        for (const place of places) {
            if (place.latitude != null && place.longitude != null) {
                const distance = getDistance(self_lat!, self_lon!, place.latitude!, place.longitude!);

                await this.activityPlaceDistanceService.create({
                    activity_id: activity_id,
                    place_id: place.id,
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
