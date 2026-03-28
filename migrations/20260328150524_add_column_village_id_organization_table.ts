import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.alterTable("organization", (table) => {
        table.integer("village_id").unsigned().nullable().after("id");
        
        table.foreign("village_id")
            .references("id")
            .inTable("villages")
            .onDelete("SET NULL")
            .onUpdate("CASCADE")
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.alterTable("organization", (table) => {
        table.dropForeign(["village_id"]);
        table.dropColumn("village_id");
    })
}

