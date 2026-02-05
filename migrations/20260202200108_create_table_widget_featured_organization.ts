import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("widget_featured_organization", (table) => {
        table.increments("id").primary();
        table.integer("organization_id")
            .unsigned()
            .notNullable()
            .unique()
            .references("id")
            .inTable("organization")
            .onDelete("CASCADE")
            .onUpdate("CASCADE");
        table.boolean("active").defaultTo(true);    
        table.timestamp("created_at").defaultTo(knex.fn.now());
        table.timestamp("updated_at").defaultTo(knex.fn.now());

    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists("widget_featured_organization");
}