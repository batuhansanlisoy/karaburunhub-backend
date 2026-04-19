import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("distance_beach_organization", (table) => {
        table.increments("id").primary();

        table.integer("beach_id")
            .unsigned()
            .notNullable()
            .references("id")
            .inTable("beachs")
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

        table.index(["beach_id"]);
        table.index(["organization_id"]);
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists("distance_beach_organization");
}




