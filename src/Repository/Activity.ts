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

    async update(id: number, activity: Partial<Activity>): Promise<number> {
        const dummy: any = { ...activity };

        if (activity.cover !== undefined) {
            dummy.cover = activity.cover ? JSON.stringify(activity.cover) : null;
        }
        
        if (activity.gallery !== undefined) {
            dummy.gallery = activity.gallery ? JSON.stringify(activity.gallery) : null;
        }

        if (activity.content !== undefined) {
            const existing = await db(this.tableName).select('content').where({ id }).first();
            let mergedContent: Record<string, any> = {};

            if (existing?.content) {
                try {
                    mergedContent = JSON.parse(existing.content);
                } catch (e) {
                    console.warn('Content parse hatası, sıfırdan başlıyoruz', e);
                }
            }

            // Yeni gelen content'i object yap
            let newContent: Record<string, any> = {};
            if (typeof activity.content === 'string') {
                try {
                    newContent = JSON.parse(activity.content);
                } catch (e) {
                    console.warn('Yeni content parse hatası', e);
                }
            } else if (typeof activity.content === 'object') {
                newContent = activity.content;
            }

            // Merge et
            mergedContent = { ...mergedContent, ...newContent };
            dummy.content = JSON.stringify(mergedContent);
        }

        // undefined alanları update'ten çıkar
        Object.keys(dummy).forEach(key => {
            if (dummy[key] === undefined) delete dummy[key];
        });

        return db(this.tableName).where({ id }).update(dummy);
    }

    async del(id: number, trx?: any): Promise<number[]> {
        if (trx) {
            return trx(this.tableName).where({ id }).del();
        }
        return db(this.tableName).where({id}).del();
    }
}