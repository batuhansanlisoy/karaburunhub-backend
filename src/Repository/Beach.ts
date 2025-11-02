import db from "../db/knex";
import { Beach } from "../Entity/Beach";

export class BeachRepository {
    private tableName = "beachs";

    async getAll(): Promise<Beach[]> {
        return db(this.tableName).select(
            "beachs.id",
            "beachs.content",
            "beachs.url",
            "beachs.created_at",
            "beachs.updated_at",
            "villages.name as village_name"
        )
        .leftJoin("villages", "beachs.village_id", "villages.id");
    }

    async create(beach: Partial<Beach>): Promise<number[]> {
        return db(this.tableName).insert(beach);
    }
}
