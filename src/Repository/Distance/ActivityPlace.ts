import db from "../../db/knex";
import { DistanceActivityPlace } from "../../Entity/Distance/ActivityPlace";

export class DistanceActivityPlaceRepo {
    private tableName = "distance_activity_place";

    async create(payload: Partial<DistanceActivityPlace>): Promise<number[]> {
        return db(this.tableName).insert(payload);
    }
}
