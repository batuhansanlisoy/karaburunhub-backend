import db from "../../db/knex";
import { DistanceActivityOrganization } from "../../Entity/Distance/ActivityOrganization";

export class DistanceActivityOrganizationRepo {
    private tableName = "distance_activity_organization";

    async list(activity_id?: number, organization_id?: number): Promise<DistanceActivityOrganization[]> {
        
        let query = db(this.tableName).select("*");

        if (activity_id != null) {
            query.where("activity_id", activity_id);
        }

        if (organization_id != null) {
            query.where("organization_id", organization_id);
        }

        query.orderBy("distance_meter", "asc");
        
        return query;
    }

    async create(payload: Partial<DistanceActivityOrganization>): Promise<number[]> {
        return db(this.tableName).insert(payload);
    }
}
