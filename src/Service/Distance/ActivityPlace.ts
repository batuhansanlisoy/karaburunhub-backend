import { ActivityRepository } from "~/Repository/Activity";
import { DistanceActivityPlace } from "../../Entity/Distance/ActivityPlace";
import { DistanceActivityPlaceRepo } from "../../Repository/Distance/ActivityPlace";

export class DistanceActivityPlaceService {
    private repo = new DistanceActivityPlaceRepo();
    private activityRepo = new ActivityRepository();

    async list(
        activity_id?: number,
        place_id?: number,
        onlyUpcoming?: boolean
    ): Promise<DistanceActivityPlace[]> {
        let upcomingActivityIds: number[] | undefined = undefined;
        // upcoming etklinikleri çekiyoruz activity repo üzerinden
        if (onlyUpcoming) {
            const upcomingActivities = await this.activityRepo.getAll(undefined, undefined, undefined, true);

            upcomingActivityIds = upcomingActivities.map(act => act.id);
        }

        return await this.repo.list(activity_id, place_id, upcomingActivityIds);
    }

    async create(payload: Partial<DistanceActivityPlace>): Promise<void> {

        await this.repo.create(payload);
    }
}
