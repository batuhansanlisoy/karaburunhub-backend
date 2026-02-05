import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("organization_category", (table) => {
        table.increments("id").primary();
        table.string("name").nullable().unique();
        table.json("extra").nullable();
        table.timestamp("created_at").defaultTo(knex.fn.now());
        table.timestamp("updated_at").defaultTo(knex.fn.now());
    });
}

export async function down(knex: Knex): Promise<void> {

    return knex.schema.dropTable("organization_category");
}

