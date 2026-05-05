import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("notifications", (table) => {
    
        table.increments("id").primary();
        table.string("title").notNullable();
        table.text("message").notNullable();
        table.boolean("is_active").defaultTo(true);
        table.timestamp("created_at").defaultTo(knex.fn.now());
        table.timestamp("updated_at").defaultTo(knex.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"));
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable("notifications");
}