// src/repositories/UserRepository.ts
import db from "../../../db/knex";
import { Item } from "../../../Entity/Organization/Category/Item";

export class ItemRepository {
    private tableName = "organization_category_item";

    async getAll(): Promise<Item[]> {
        return db(this.tableName).select("*");
    }

    async getByOraganizationCategoryId(id: number): Promise<Item[]> {
        return db(this.tableName).where({ organization_category_id: id })
    }

    async create(item: Partial<Item>): Promise<number[]> {
        return db(this.tableName).insert(item);
    }

    async del(id: number): Promise<number[]> {
        return db(this.tableName).where({ id }).del();
    }
}
