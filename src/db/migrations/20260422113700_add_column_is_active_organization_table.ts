import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.alterTable("organization", (table) => {
        table.boolean("is_active")
            .defaultTo(true)
            .notNullable()
            .after("highlight");
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.alterTable("organization", (table) => {
        table.dropColumn("is_active");
    });
}

