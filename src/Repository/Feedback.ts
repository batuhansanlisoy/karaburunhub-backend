import db from "../db/knex";
import { Feedback } from "../Entity/Feedback";

export class FeedbackRepository {
    private tableName = "feedbacks";

    async getAll(is_read?: boolean): Promise<Feedback[]> {
        let query = db(this.tableName).select("*");

        if (is_read !== undefined) {
            query = query.where("is_read", is_read);
        }

        return query;
    }

    async create(payload: Partial<Feedback>): Promise<number[]> {
        const dbPayload = {
            ...payload,
            content: payload.content ? JSON.stringify(payload.content) : null
        }
        return db(this.tableName).insert(dbPayload);
    }
}
