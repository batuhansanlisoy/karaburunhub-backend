import db from "../db/knex";
import { RequestBusiness } from "../Entity/RequestBusiness";

export class RequestBusinessRepository {
    private tableName = "request_business";

    async getAll(is_read?: boolean, status?: "pending" | "approved" | "rejected"): Promise<RequestBusiness[]> {
        let query = db(this.tableName).select("*");

        if (is_read !== undefined) {
            query = query.where("is_read", is_read); 
        }

        if (status) {
            query.where("status", status);
        }

        query.orderBy("created_at", "desc");

        return query;
    }

    async create(payload: Partial<RequestBusiness>): Promise<number[]> {
        const dbPayload = {
            ...payload,
            sender: payload.sender ? JSON.stringify(payload.sender) : null,
            business: payload.business ? JSON.stringify(payload.business): null
        }

        return db(this.tableName).insert(dbPayload);
    }

    async patch(id: number, field: string, value: any): Promise<number> {
        return db(this.tableName)
            .where({ id: id })
            .update({
                [field]: value
        });
    }
}
