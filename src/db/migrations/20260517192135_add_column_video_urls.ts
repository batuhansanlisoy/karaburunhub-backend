import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.alterTable("beachs", (table) => {
        table.json("video_urls")
            .nullable()
            .defaultTo(JSON.stringify([]))
            .after("gallery");
    });

    await knex.schema.alterTable("place", (table) => {
        table.json("video_urls")
            .nullable()
            .defaultTo(JSON.stringify([]))
            .after("gallery");
    });

    await knex.schema.alterTable("activity", (table) => {
        table.json("video_urls")
            .nullable()
            .defaultTo(JSON.stringify([]))
            .after("gallery");
    });

    await knex.schema.alterTable("organization", (table) => {
        table.json("video_urls")
            .nullable()
            .defaultTo(JSON.stringify([]))
            .after("gallery");
    });

    await knex.schema.alterTable("local_producers", (table) => {
        table.json("video_urls")
            .nullable()
            .defaultTo(JSON.stringify([]))
            .after("gallery");
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable("organization", (table) => {
        table.dropColumn("video_urls");
    });

    await knex.schema.alterTable("activity", (table) => {
        table.dropColumn("video_urls");
    });

    await knex.schema.alterTable("place", (table) => {
        table.dropColumn("video_urls");
    });

    await knex.schema.alterTable("beachs", (table) => {
        table.dropColumn("video_urls");
    });

    await knex.schema.alterTable("local_producers", (table) => {
        table.dropColumn("video_urls");
    });
}

