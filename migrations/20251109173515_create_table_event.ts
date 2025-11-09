import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("event", (table) => {
        
        table.increments("id").primary();
        table.integer("village_id")
            .unsigned()
            .notNullable()
            .references("id")
            .inTable("villages")
            .onDelete("RESTRICT")
            .onUpdate("CASCADE");

        table.string("name").notNullable();
        table.json("content").nullable();
        
        table.string("logo_url").nullable();
        table.json("gallery").nullable();
        
        table.string("address").notNullable();
        table.decimal("latitude", 10, 7).nullable();
        table.decimal("longitude", 10, 7).nullable();
        
        table.date("begin").nullable();
        table.date("end").nullable();

        table.timestamp("created_at").defaultTo(knex.fn.now());
        table.timestamp("updated_at").defaultTo(knex.fn.now());
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable("event", (table) => {
        table.dropForeign(["village_id"]);
    });
    return knex.schema.dropTable("event");
}

