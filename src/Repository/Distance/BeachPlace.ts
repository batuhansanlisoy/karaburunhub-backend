import db from "../../db/knex";
import { DistanceBeachPlace } from "../../Entity/Distance/BeachPlace";

export class DistanceBeachPlaceRepo {
    private tableName = "distance_beach_place";

    async list(beach_id?: number, place_id?: number): Promise<DistanceBeachPlace[]> {
        
        let query = db(this.tableName).select("*");

        if (place_id != null) {
            query.where("place_id", place_id);
        }

        if (beach_id != null) {
            query.where("beach_id", beach_id);
        }

        query.orderBy("distance_meter", "asc");
        
        return query;
    }

    async create(payload: Partial<DistanceBeachPlace>): Promise<number[]> {
        return db(this.tableName).insert(payload);
    }
}
