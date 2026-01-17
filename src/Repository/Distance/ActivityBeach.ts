import db from "../../db/knex";
import { DistanceActivityBeach } from "../../Entity/Distance/ActivityBeach";

export class DistanceActivityBeachRepo {
    private tableName = "distance_activity_beach";

    async create(payload: Partial<DistanceActivityBeach>): Promise<number[]> {
        return db(this.tableName).insert(payload);
    }

}
