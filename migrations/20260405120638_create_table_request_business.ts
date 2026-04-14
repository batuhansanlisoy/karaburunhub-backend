import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("request_business", (table) => {
        table.increments("id").primary();
        table.json("sender").nullable();
        table.json("business").nullable();
        table.boolean("is_read").notNullable().defaultTo(false);
        table.string("package").notNullable().defaultTo("standart");
        table.enum("status", ["pending", "approved", "rejected"]).defaultTo("pending"); // 0:pending, 1: approved, 2: rejected
        table.timestamp("created_at").defaultTo(knex.fn.now());
        table.timestamp("updated_at")
             .defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists("request_business");
}