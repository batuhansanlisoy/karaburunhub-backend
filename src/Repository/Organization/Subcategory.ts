// src/repositories/UserRepository.ts
import db, { Knex } from "../../db/knex";
import { Subcategory } from "../../Entity/Organization/Subcategory";

export class SubcategoryRepository {
    private tableName = "organization_subcategory";

    async getAll(): Promise<Subcategory[]> {
        return db(this.tableName).select("*");
    }

    async create(subcategory: Partial<Subcategory>, trx?: Knex.Transaction): Promise<number[]> {
        const query = trx ? trx(this.tableName) : db(this.tableName);
        return query.insert(subcategory);
    }

    async del(id: number): Promise<number[]> {
        return db(this.tableName).where({ id }).del();
    }
}
