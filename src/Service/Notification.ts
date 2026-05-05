import db from "../db/knex";
import { Notification } from "../Entity/Notification";
import { BaseService } from "./BaseService";
import { NotificationRepository } from "../Repository/Notification";

export class NotificationService extends BaseService<Notification> {
    constructor() {
        super(new NotificationRepository())
    };

    async single(id: number): Promise<Notification> {
        return this.repo.single(id);
    }

    async list(ids?: number[]): Promise<Notification[]> {

        return this.repo.getAll(ids);
    }

    async create(notification: Partial<Notification>): Promise<number[]> {

        const notificationIds = await this.repo.create(notification);

        return notificationIds[0];
    }

    async update(id: number, payload: Partial<Notification>): Promise<void> {
        await this.repo.update(id, payload);
    }

    async del(id: number): Promise<void> {

        await db.transaction(async (trx) => {
            const notification = await this.repo.single(id);

            if (!notification) {
                throw new Error("notification not found");
            }

            await this.repo.del(id, trx);
        });
    }
}
