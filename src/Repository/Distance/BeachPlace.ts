import db from "../../db/knex";
import { DistanceBeachPlace } from "../../Entity/Distance/BeachPlace";

export class DistanceBeachPlaceRepo {
    private tableName = "distance_beach_place";

    async create(payload: Partial<DistanceBeachPlace>): Promise<number[]> {
        return db(this.tableName).insert(payload);
    }
}
