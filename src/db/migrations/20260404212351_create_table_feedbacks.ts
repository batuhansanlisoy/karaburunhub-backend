import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("feedbacks", (table) => {
        table.increments("id").primary();
        table.string("name").nullable();
        table.string("last_name").nullable();
        table.string("email").nullable();
        table.string("phone").nullable();
        table.json("content").notNullable();
        table.boolean("is_read").defaultTo(false);
        table.timestamp("created_at").defaultTo(knex.fn.now());
        table.timestamp("updated_at").defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
        table.index('is_read');
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists("feedbacks");
}