import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("organization", (table) => {
    
        table.increments("id").primary();
        table.integer("category_id")
        .unsigned()
        .notNullable()
        .references("id")
        .inTable("organization_category")
        .onDelete("RESTRICT")
        .onUpdate("RESTRICT");

        table.string("name").notNullable();
        table.string("email").notNullable();
        table.string("phone").notNullable();

        table.json("content").nullable();
        table.string("website").nullable();

        table.json("logo").nullable();
        table.json("gallery").nullable();

        table.string("address").notNullable();
        table.decimal("latitude", 10, 7).nullable();
        table.decimal("longitude", 10, 7).nullable();

        table.timestamp("created_at").defaultTo(knex.fn.now());
        table.timestamp("updated_at").defaultTo(knex.fn.now());
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable("organization", (table) => {
        table.dropForeign(["category_id"]);
    });
    return knex.schema.dropTable("organization");
}

