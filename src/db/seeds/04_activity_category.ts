import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
    await knex.raw('SET FOREIGN_KEY_CHECKS = 0');

    await knex("activity_category").truncate();

    await knex("activity_category").insert([
        { id: 1, name: "Doğa & Macera" },
        { id: 2, name: "Spor" },
        { id: 3, name: "Kültür & Sanat" },
        { id: 4, name: "Festival" },
        { id: 5, name: "Bayram" },
        { id: 6, name: "Konser" },
        { id: 7, name: "Yarışma" },
        { id: 8, name: "Sosyal" },
    ]);

    // Kalkanları geri aç
    await knex.raw('SET FOREIGN_KEY_CHECKS = 1');
};