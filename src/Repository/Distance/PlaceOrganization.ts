import db from "../../db/knex";
import { DistancePlaceOrganization } from "../../Entity/Distance/PlaceOrganization";

export class DistancePlaceOrganizationRepo {
    private tableName = "distance_place_organization";

    async list(organization_id?: number, place_id?: number): Promise<DistancePlaceOrganization[]> {
        
        let query = db(this.tableName).select("*");

        if (place_id != null) {
            query.where("place_id", place_id);
        }

        if (organization_id != null) {
            query.where("organization_id", organization_id);
        }

        query.orderBy("distance_meter", "asc");
        
        return query;
    }

    async create(payload: Partial<DistancePlaceOrganization>): Promise<number[]> {
        return db(this.tableName).insert(payload);
    }
}
