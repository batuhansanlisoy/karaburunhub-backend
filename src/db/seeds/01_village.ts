import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
    //burda del yaparsam id 18 de kaldı diyelim 19 diye devam eder
    // truncate yapınca tekrar idleri 1 den başlatıyor.
    await knex.raw('SET FOREIGN_KEY_CHECKS = 0');

    await knex("villages").del();

    await knex("villages").insert([
        { id: 1, name: "Amberseki" },
        { id: 2, name: "Saip" },
        { id: 3, name: "Bozköy" },
        { id: 4, name: "Tepeboz" },
        { id: 5, name: "Yeniliman" },
        { id: 6, name: "Hasseki" },
        { id: 7, name: "Salman" },
        { id: 8, name: "İnecik" },
        { id: 9, name: "Kösedere" },
        { id: 10, name: "Sarpıncık" },
        { id: 11, name: "Sazak" },
        { id: 12, name: "Eğlenhoca" },
        { id: 13, name: "Parlak" },
        { id: 14, name: "Küçükbahçe" },
        { id: 15, name: "Yaylaköy" },
        { id: 16, name: "Mordoğan" },
        { id: 17, name: "Karaburun" },
    ]);

    await knex.raw('SET FOREIGN_KEY_CHECKS = 1');
};
