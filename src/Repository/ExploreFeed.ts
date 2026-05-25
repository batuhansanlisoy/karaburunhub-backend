import db from "../db/knex";
import { ExploreFeed } from "~/Entity/ExploreFeed";

export class ExploreFeedRepository {
    private tableName = "explore_feeds";

    getById(id: number): Promise<ExploreFeed> {
        return db(this.tableName).where({ id }).first();
    }

    getAll(
        shuffle?: boolean,
        active?: boolean,
        itemType?: string,
        itemId?: number
    ): Promise<ExploreFeed[]> {
        let query = db(this.tableName).select("*");

        if (active !== undefined) {
            query.where("is_active", active);
        }

        if (itemType !== undefined) {
            query.where("item_type", itemType);
        }

        if (itemId !== undefined && itemType !== undefined) {
            query.where({
                "item_id": itemId,
                "item_type": itemType
            });
        }

        if (shuffle === true) {
            query.orderBy("score", "desc").orderByRaw("RAND()");
        } else {
            query.orderBy("score", "desc").orderBy("id", "desc");
        }

        return query;
    }

    create(payload: Partial<ExploreFeed>): Promise<number[]> {
        return db(this.tableName).insert(payload);
    }

    patch(id: number, field: string, value: any): Promise<number> {
        return db(this.tableName)
            .where({ id: id })
            .update({
                [field]: value
            });
    }

    findByVideoUrl(fullVideoUrl: string): Promise<ExploreFeed | undefined> {
        return db(this.tableName)
            .where("video_url", fullVideoUrl)
            .first();
    }

    findByTarget(item_type: string, item_id: number): Promise<ExploreFeed | undefined> {
        return db(this.tableName)
            .where("item_type", item_type)
            .where("item_id", item_id)
            .first();
    }

    findAllByTarget(item_type: string, item_id: number): Promise<ExploreFeed[]> {
        return db(this.tableName)
            .where({ item_type, item_id });
    }

    del(id: number, trx?: any): Promise<number[]> {
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
