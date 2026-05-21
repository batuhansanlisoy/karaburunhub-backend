import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("explore_feeds", (table) => {
        
        table.increments("id").primary();
        table.string("item_type").notNullable();
        table.integer("item_id").notNullable();
        table.string("title").notNullable();
        table.string("video_url").notNullable();
        table.decimal("score", 10, 2).defaultTo(0.00);
        table.boolean("is_active").defaultTo(true);
        table.timestamps(true, true);

        table.index(["video_url"], "idx_explore_video_url");
        table.index(["item_type", "item_id"], "idx_explore_item");
        table.index(["is_active", "score"], "idx_explore_feed_rank");
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable("explore_feeds");
}