import db from "../../db/knex";
import { DistanceActivityBeach } from "../../Entity/Distance/ActivityBeach";

export class DistanceActivityBeachRepo {
    private tableName = "distance_activity_beach";

    async list(activity_id?: number, beach_id?: number): Promise<DistanceActivityBeach[]> {
        
        let query = db(this.tableName).select("*");

        if (activity_id != null) {
            query.where("activity_id", activity_id);
        }

        if (beach_id != null) {
            query.where("beach_id", beach_id);
        }

        query.orderBy("distance_meter", "asc");
        
        return query;
    }

    async create(payload: Partial<DistanceActivityBeach>): Promise<number[]> {
        return db(this.tableName).insert(payload);
    }

}