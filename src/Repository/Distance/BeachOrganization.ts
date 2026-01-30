import db from "../../db/knex";
import { DistanceBeachOrganization } from "../../Entity/Distance/BeachOrganization";

export class DistanceBeachOrganizationRepo {
    private tableName = "distance_beach_organization";

    async list(beach_id?: number, organization_id?: number): Promise<DistanceBeachOrganization[]> {
        
        let query = db(this.tableName).select("*");

        if (organization_id != null) {
            query.where("organization_id", organization_id);
        }

        if (beach_id != null) {
            query.where("beach_id", beach_id);
        }

        query.orderBy("distance_meter", "asc");
        
        return query;
    }

    async create(payload: Partial<DistanceBeachOrganization>): Promise<number[]> {
        return db(this.tableName).insert(payload);
    }
}
