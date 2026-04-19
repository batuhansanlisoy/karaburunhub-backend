import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
    await knex.raw('SET FOREIGN_KEY_CHECKS = 0');

    await knex("organization_category").truncate();

    // Inserts seed entries
    await knex("organization_category").insert([
        { 
            id: 1, 
            name: "Yemek", 
            extra: JSON.stringify({ icon: "f1f2", icon_color: "FF5733" }) 
        },
        { 
            id: 2, 
            name: "Konaklama", 
            extra: JSON.stringify({ icon: "efdf", icon_color: "5C6BC0" }) 
        },
        { 
            id: 3, 
            name: "Yapı/İnşaat", 
            extra: JSON.stringify({ icon: "ea3c", icon_color: "FFB300" }) 
        }
    ]);

    await knex.raw('SET FOREIGN_KEY_CHECKS = 1');
};
