// src/repositories/UserRepository.ts
import db from "../../db/knex";
import { Category } from "../../Entity/Organization/Category";

export class CategoryRepository {
    private tableName = "organization_category";

    async getAll(): Promise<Category[]> {
        return db(this.tableName).select("*");
    }

    async create(category: Category): Promise<number[]> {
        return db(this.tableName).insert(category);
    }
}
