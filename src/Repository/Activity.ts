import db from "../db/knex";
import { Activity } from "../Entity/Activity";

export class ActivityRepository {
    private tableName = "activity";

    async single(id: number): Promise<Activity> {
        const activity = await db(this.tableName).where({ id }).first();
        
        if (activity?.cover && typeof activity.cover === "string") {
            activity.cover = JSON.parse(activity.cover);
        }

        return activity;
    }

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

    async del(id: number, trx?: any): Promise<number[]> {
        if (trx) {
            return trx(this.tableName).where({ id }).del();
        }
        return db(this.tableName).where({id}).del();
    }
}