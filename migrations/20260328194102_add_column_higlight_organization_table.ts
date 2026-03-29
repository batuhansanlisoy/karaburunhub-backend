import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.alterTable("organization", (table) => {
        table.boolean("highlight")
            .defaultTo(false)
            .notNullable()
            .after("gallery");
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.alterTable("organization", (table) => {
        table.dropColumn("highlight");
    });
}

