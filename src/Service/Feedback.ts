import { BaseService } from "./BaseService";
import { FeedbackRepository } from "../Repository/Feedback";
import { Feedback } from "../Entity/Feedback";

export class FeedbackService extends BaseService<Feedback> {

    constructor() {
        super(new FeedbackRepository());
    }

    async list(is_read?: boolean): Promise<Feedback[]> {
        
        return this.repo.getAll( is_read);
    }

    async create(payload: Partial<Feedback>): Promise<number[]> {

        const resultIds = await this.repo.create(payload);
    
        return resultIds;
    }
}
