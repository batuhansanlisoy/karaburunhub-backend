import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("beachs", (table) => {
        table.increments("id").primary();

        table.integer("village_id")
            .unsigned()
            .notNullable()
            .references("id")
            .inTable("villages")
            .onDelete("CASCADE")
            .onUpdate("CASCADE");

        table.json("content").nullable();
        table.string("url").nullable();
        table.timestamp("created_at").defaultTo(knex.fn.now());
        table.timestamp("updated_at").defaultTo(knex.fn.now());
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable("beachs", (table) => {
        table.dropForeign(["village_id"]);
    });
    
    return knex.schema.dropTable("beachs");
}

