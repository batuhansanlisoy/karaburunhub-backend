import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("organization_category_item", (table) => {
        table.increments("id").primary();
        table.string("name").nullable().unique();

        table.integer("organization_category_id")
            .unsigned()
            .notNullable()
            .references("id")
            .inTable("organization_category")
            .onDelete("RESTRICT")
            .onUpdate("CASCADE");

        table.timestamp("created_at").defaultTo(knex.fn.now());
        table.timestamp("updated_at").defaultTo(knex.fn.now());
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable("organization_category_item", (table) => {
        table.dropForeign(["organization_category_id"]);
    });

    return knex.schema.dropTable("organization_category_item");
}

