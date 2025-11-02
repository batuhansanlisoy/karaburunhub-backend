// src/repositories/UserRepository.ts
import db from "../db/knex";
import { Village } from "../Entity/Village";

export class VillageRepository {
    private tableName = "villages";

    async getAll(): Promise<Village[]> {
        return db(this.tableName).select("*");
    }

    async create(village: Partial<Village>): Promise<number[]> {
        return db(this.tableName).insert(village);
    }
}
