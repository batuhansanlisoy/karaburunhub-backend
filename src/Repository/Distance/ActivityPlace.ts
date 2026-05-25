import db from "../../db/knex";
import { DistanceActivityPlace } from "../../Entity/Distance/ActivityPlace";

export class DistanceActivityPlaceRepo {
    private tableName = "distance_activity_place";

    async list(
        activity_id?: number,
        place_id?: number,
        activityIds?: number[]
    ): Promise<DistanceActivityPlace[]> {
        
        let query = db(this.tableName).select("*");

        if (activity_id != null) {
            query.where("activity_id", activity_id);
        }

        if (place_id != null) {
            query.where("place_id", place_id);
        }

        if (activityIds !== undefined && activityIds.length > 0) {
            query.whereIn("activity_id", activityIds);
        }

        query.orderBy("distance_meter", "asc");
        
        return query;
    }

    async create(payload: Partial<DistanceActivityPlace>): Promise<number[]> {
        return db(this.tableName).insert(payload);
    }
}
