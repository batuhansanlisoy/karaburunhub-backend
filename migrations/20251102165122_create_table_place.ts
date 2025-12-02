import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("place", (table) => {
    
        table.increments("id").primary();
        table.integer("village_id")
        .unsigned()
        .notNullable()
        .references("id")
        .inTable("villages")
        .onDelete("RESTRICT")
        .onUpdate("RESTRICT");

        table.string("name").notNullable();
        table.json("content").nullable();
        table.string("cover").nullable();
        table.json("gallery").nullable();

        table.string("address").notNullable();
        table.decimal("latitude", 10, 7).nullable();
        table.decimal("longitude", 10, 7).nullable();

        table.timestamp("created_at").defaultTo(knex.fn.now());
        table.timestamp("updated_at").defaultTo(knex.fn.now());
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable("place", (table) => {
        table.dropForeign(["village_id"]);
    });
    return knex.schema.dropTable("place");
}

