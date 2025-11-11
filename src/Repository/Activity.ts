import db from "../db/knex";
import { Activity } from "../Entity/Activity";

export class ActivityRepository {
    private tableName = "activity";

    async getAll(): Promise<Activity[]> {
        return db(this.tableName).select("*");
    }

    async getByVillageId(village_id: number): Promise<Activity[]> {
        return db(this.tableName).where("village_id", village_id);
    }

    async create(activity: Partial<Activity>): Promise<number[]> {
        return db(this.tableName).insert(activity);
    }

    async del(id: number): Promise<number[]> {
        return db(this.tableName).where({ id }).del();
    }
}
