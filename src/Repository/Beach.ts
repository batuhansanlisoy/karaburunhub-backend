import db from "../db/knex";
import { Beach } from "../Entity/Beach";

export class BeachRepository {
    private tableName = "beachs";

    async getAll(): Promise<Beach[]> {
        return db(this.tableName).select(
            "beachs.id",
            "beachs.name",
            "beachs.address",
            "beachs.logo_url",
            "beachs.created_at",
            "beachs.updated_at",
            "villages.name as village_name"
        )
        .leftJoin("villages", "beachs.village_id", "villages.id");
    }

    async getById(id: number): Promise<Beach> {
        return db(this.tableName).select(
            "beachs.id",
            "beachs.name",
            "beachs.address",
            "beachs.logo_url",
            "beachs.created_at",
            "beachs.updated_at",
            "villages.name as village_name"
        )
        .leftJoin("villages", "beachs.village_id", "villages.id")
        .where("beachs.id", id)
        .first();
    }

    async create(beach: Partial<Beach>): Promise<number[]> {
        const dbBeach = {
            ...beach,
            gallery: beach.gallery ? JSON.stringify(beach.gallery) : null
        }
        return db(this.tableName).insert(dbBeach);
    }

    async del(id: number): Promise<number[]> {
        return db(this.tableName).where({id}).del();
    }
}
