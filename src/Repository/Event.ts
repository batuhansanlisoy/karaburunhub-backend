import db from "../db/knex";
import { Event } from "../Entity/Event";

export class EventRepository {
    private tableName = "event";

    async getAll(): Promise<Event[]> {
        return db(this.tableName).select("*");
    }

    async getByVillageId(village_id: number): Promise<Event[]> {
        return db(this.tableName).where("village_id", village_id);
    }

    async create(event: Partial<Event>): Promise<number[]> {
        return db(this.tableName).insert(event);
    }

    async del(id: number): Promise<number[]> {
        return db(this.tableName).where({ id }).del();
    }
}
