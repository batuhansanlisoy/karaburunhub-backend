// src/repositories/UserRepository.ts
import db from "../db/knex";
import { User } from "../Entity/User";

export class UserRepository {
    private tableName = "users";

    async getAll(): Promise<User[]> {
        return db(this.tableName).select("*");
    }

    async create(user: User): Promise<number[]> {
        return db(this.tableName).insert(user);
    }
}
