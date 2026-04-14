import { RequestBusiness } from "../Entity/RequestBusiness";
import { BaseService } from "./BaseService";
import { RequestBusinessRepository } from "../Repository/RequestBusiness";

export class RequestBusinessService extends BaseService<RequestBusiness> {
    constructor() {
        super(new RequestBusinessRepository())
    };

    async list(is_read?: boolean, status?: "pending" | "approved" | "rejected"): Promise<RequestBusiness[]> {
        
        return this.repo.getAll(is_read, status);
    }

    async create(payload: Partial<RequestBusiness>): Promise<number[]> {

        const resultIds = await this.repo.create(payload);

        return resultIds;
    }

    async patch(id: number, field: string, value: any): Promise<number> {
        return await this.repo.patch(id, field, value);
    }
}
