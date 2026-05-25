import { DistanceActivityBeach } from "../../Entity/Distance/ActivityBeach";
import { DistanceActivityBeachRepo } from "../../Repository/Distance/ActivityBeach";
import { ActivityRepository } from "~/Repository/Activity";

export class DistanceActivityBeachService {
    private repo = new DistanceActivityBeachRepo();
    private activityRepo = new ActivityRepository();

    async list(
        activity_id?: number,
        beach_id?: number,
        onlyUpcoming?: boolean
    ): Promise<DistanceActivityBeach[]> {
        let upcomingActivityIds: number[] | undefined = undefined;
        // upcoming etklinikleri çekiyoruz activity repo üzerinden
        if (onlyUpcoming) {
            const upcomingActivities = await this.activityRepo.getAll(undefined, undefined, undefined, true);

            upcomingActivityIds = upcomingActivities.map(act => act.id);
        }

        return await this.repo.list(activity_id, beach_id, upcomingActivityIds);
    }

    async create(payload: Partial<DistanceActivityBeach>): Promise<void> {

        await this.repo.create(payload);
    }
}
