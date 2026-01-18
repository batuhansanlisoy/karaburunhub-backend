import db from "../../db/knex";
import { DistanceActivityOrganization } from "../../Entity/Distance/ActivityOrganization";

export class DistanceActivityOrganizationRepo {
    private tableName = "distance_activity_organization";

    async create(payload: Partial<DistanceActivityOrganization>): Promise<number[]> {
        return db(this.tableName).insert(payload);
    }
}
