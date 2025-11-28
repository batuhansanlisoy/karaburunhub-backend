import db from "../db/knex";
import { Activity } from "../Entity/Activity";

export class ActivityRepository {
    private tableName = "activity";

    async getAll(village_id?: number, category_id?: number): Promise<Activity[]> {

        let query = db(this.tableName).select("*");

        if (village_id != null) {
            query = query.where("village_id", village_id);
        }

        if (category_id != null) {
            query = query.where("category_id", category_id);
        }

        return query;
    }

    async create(activity: Partial<Activity>): Promise<number[]> {
        const dbActivity = {
            ...activity,
            gallery: activity.gallery ? JSON.stringify(activity.gallery) : null
        };
        return db(this.tableName).insert(dbActivity);
    }

    async del(id: number): Promise<number[]> {
        return db(this.tableName).where({ id }).del();
    }
}