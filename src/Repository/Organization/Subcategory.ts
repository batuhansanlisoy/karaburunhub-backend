// src/repositories/UserRepository.ts
import db, { Knex } from "../../db/knex";
import { Subcategory } from "../../Entity/Organization/Subcategory";

export class SubcategoryRepository {
    private tableName = "organization_subcategory";

    async getAll(organizationIds?: number[],): Promise<Subcategory[]> {
        let query = db(this.tableName).select("*");

        if (organizationIds && organizationIds.length > 0) {
            query = query.whereIn("organization_id", organizationIds)
        }

        return query;
    }

    async create(subcategory: Partial<Subcategory>, trx?: Knex.Transaction): Promise<number[]> {
        const query = trx ? trx(this.tableName) : db(this.tableName);
        return query.insert(subcategory);
    }

    async del(id: number): Promise<number[]> {
        return db(this.tableName).where({ id }).del();
    }
}
