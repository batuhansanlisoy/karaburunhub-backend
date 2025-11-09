import { EventRepository } from "../Repository/Event";
import { Event } from "../Entity/Event";

export class EventService {
    private repo = new EventRepository();

    async list(village_id?: number): Promise<Event[]> {
        if (village_id) {
            return this.repo.getByVillageId(village_id);
        }

        return this.repo.getAll();
    }

    async create(event: Partial<Event>): Promise<void> {
        await this.repo.create(event);
    }

    async del(id: number): Promise<void> {
        await this.repo.del(id);
    }
}
