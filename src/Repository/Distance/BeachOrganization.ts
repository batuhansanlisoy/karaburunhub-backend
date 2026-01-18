import db from "../../db/knex";
import { DistanceBeachOrganization } from "../../Entity/Distance/BeachOrganization";

export class DistanceBeachOrganizationRepo {
    private tableName = "distance_beach_organization";

    async create(payload: Partial<DistanceBeachOrganization>): Promise<number[]> {
        return db(this.tableName).insert(payload);
    }
}
