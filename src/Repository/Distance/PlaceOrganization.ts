import db from "../../db/knex";
import { DistancePlaceOrganization } from "../../Entity/Distance/PlaceOrganization";

export class DistancePlaceOrganizationRepo {
    private tableName = "distance_place_organization";

    async create(payload: Partial<DistancePlaceOrganization>): Promise<number[]> {
        return db(this.tableName).insert(payload);
    }
}
