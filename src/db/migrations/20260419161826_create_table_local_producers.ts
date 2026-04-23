import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("local_producers", (table) => {
        table.increments("id").primary();
        table.string("name").notNullable();
        table.string("email").nullable();
        table.string("phone").notNullable();
        table.string("title").nullable();
        table.json("extra").nullable();
        table.integer("village_id")
            .unsigned()
            .references("id")
            .inTable("villages")
            .onDelete("RESTRICT")
            .onUpdate("CASCADE");
        table.string("address").notNullable();
        table.boolean("is_active").defaultTo(true);
        table.boolean("highlight").defaultTo(false);
        table.json("cover").nullable();
        table.json("gallery").nullable();
        table.timestamps(true, true);
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable("local_producers");
}

