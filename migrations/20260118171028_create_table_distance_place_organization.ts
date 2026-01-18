import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("distance_place_organization", (table) => {
        table.increments("id").primary();

        table.integer("place_id")
            .unsigned()
            .notNullable()
            .references("id")
            .inTable("place")
            .onDelete("CASCADE")
            .onUpdate("CASCADE");
        
        table.integer("organization_id")
            .unsigned()
            .notNullable()
            .references("id")
            .inTable("organization")
            .onDelete("CASCADE")
            .onUpdate("CASCADE");
        
        table.integer("distance_meter").unsigned().nullable();
        
        table.timestamp("created_at").defaultTo(knex.fn.now());
        table.timestamp("updated_at").defaultTo(knex.fn.now());

        table.index(["place_id"]);
        table.index(["organization_id"]);
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists("distance_place_organization");
}




