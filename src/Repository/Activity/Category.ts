// src/repositories/UserRepository.ts
import db from "../../db/knex";
import { Category } from "../../Entity/Activity/Category";

export class CategoryRepository {
    private tableName = "activity_category";

    async getAll(): Promise<Category[]> {
        return db(this.tableName).select("*");
    }

    async create(category: Partial<Category>): Promise<number[]> {
        return db(this.tableName).insert(category);
    }

    async del(id: number): Promise<number[]> {
        return db(this.tableName).where({ id }).del();
    }
}
