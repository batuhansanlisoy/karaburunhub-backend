import db from "../db/knex";
import { ExploreFeed } from "~/Entity/ExploreFeed";

export class ExploreFeedRepository {
    private tableName = "explore_feeds";

    async getById(id: number): Promise<ExploreFeed> {
        const explore_feed = await db(this.tableName).where({ id }).first();

        return explore_feed;
    }

    async getAll(): Promise<ExploreFeed[]> {
        let query = db(this.tableName).select("*");

        return query;
    }

    async create(payload: Partial<ExploreFeed>): Promise<number[]> {
        return db(this.tableName).insert(payload);
    }

    async patch(id: number, field: string, value: any): Promise<number> {
        return db(this.tableName)
            .where({ id: id })
            .update({
                [field]: value
            });
    }

    async findByVideoUrl(fullVideoUrl: string): Promise<ExploreFeed | undefined> {
        return db(this.tableName)
            .where("video_url", fullVideoUrl)
            .first();
    }

    async findByTarget(item_type: string, item_id: number): Promise<ExploreFeed | undefined> {
        return db(this.tableName)
            .where("item_type", item_type)
            .where("item_id", item_id)
            .first();
    }

    async findAllByTarget(item_type: string, item_id: number): Promise<ExploreFeed[]> {
        return db(this.tableName)
            .where({ item_type, item_id });
    }

    async del(id: number, trx?: any): Promise<number[]> {
        if (trx) {
            return trx(this.tableName).where({ id }).del();
        }
        return db(this.tableName).where({id}).del();
    }

    async delByTarget(item_type: string, item_id: number, trx?: any): Promise<void> {
        await db(this.tableName)
            .where({item_type, item_id})
            .del()
            .transacting(trx);
    }
}
