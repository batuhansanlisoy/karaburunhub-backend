import db from "../db/knex";
import { Notification } from "../Entity/Notification";

export class NotificationRepository {
    private tableName = "notifications";

    async getById(id: number): Promise<Notification> {
        const notification = await db(this.tableName).where({ id }).first();

        return notification;
    }

    async getAll(ids?: number[]): Promise<Notification[]> {
        let query = db(this.tableName).select("notifications.*");
        
        if (ids && ids.length > 0) {
            query = query.whereIn("id", ids);
        }

        return query.orderBy("created_at", "desc");
    }

    async create(notification: Partial<Notification>): Promise<number[]> {
        return db(this.tableName).insert(notification);
    }

    async update(id: number, payload: Partial<Notification>): Promise<number> {
        return db(this.tableName).where({ id }).update(payload);
    }

    async del(id: number, trx?: any): Promise<number[]> {
        if (trx) {
            return trx(this.tableName).where({ id }).del();
        }

        return db(this.tableName).where({id}).del();
    }
}
