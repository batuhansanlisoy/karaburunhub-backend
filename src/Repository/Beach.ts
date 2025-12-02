import db from "../db/knex";
import { Beach } from "../Entity/Beach";

export class BeachRepository {
    private tableName = "beachs";

    async single(id: number): Promise<Beach> {
        const beach = await db(this.tableName).where({ id }).first();
        if (beach?.cover && typeof beach.cover === "string") {
            beach.cover = JSON.parse(beach.cover);
        }
        return beach;
    }

    async getAll(): Promise<Beach[]> {
        return db(this.tableName).select(
            "beachs.*",
            "villages.name as village_name")
            .leftJoin("villages", "beachs.village_id", "villages.id");
    }

    async getById(id: number): Promise<Beach> {
        return db(this.tableName).select(
            "beachs.*",
            "villages.name as village_name")
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

    async del(id: number, trx?: any): Promise<number[]> {
        if (trx) {
            return trx(this.tableName).where({ id }).del();
        }
        return db(this.tableName).where({id}).del();
    }
}
