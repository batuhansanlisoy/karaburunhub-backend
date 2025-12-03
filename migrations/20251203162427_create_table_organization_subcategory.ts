import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("organization_subcategory", (table) => {
        table.increments("id").primary();

        table.integer("item_id")
            .unsigned()
            .notNullable()
            .references("id")
            .inTable("organization_category_item")
            .onDelete("RESTRICT")
            .onUpdate("CASCADE");

        table.integer("organization_id")
            .unsigned()
            .notNullable()
            .references("id")
            .inTable("organization")
            .onDelete("CASCADE")
            .onUpdate("CASCADE");

        table.timestamp("created_at").defaultTo(knex.fn.now());
        table.timestamp("updated_at").defaultTo(knex.fn.now());
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable("organization_subcategory", (table) => {
        table.dropForeign(["item_id"]);
        table.dropForeign(["organization_id"]);
    });

    return knex.schema.dropTable("organization_subcategory");
}

