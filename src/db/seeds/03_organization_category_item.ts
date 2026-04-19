import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
    // Kısıtlamaları kapatıp temizlik yapalım
    await knex.raw('SET FOREIGN_KEY_CHECKS = 0');
    await knex("organization_category_item").truncate();

    await knex("organization_category_item").insert([
        { name: "Kahvaltı", organization_category_id: 1 },
        { name: "Deniz Ürünleri", organization_category_id: 1 },
        { name: "Et & Kebap", organization_category_id: 1 },
        { name: "Kafe", organization_category_id: 1 },
        { name: "Tatlı", organization_category_id: 1 },
        { name: "Fast Food", organization_category_id: 1 },
        { name: "Aperatif", organization_category_id: 1 },
        { name: "Döner", organization_category_id: 1 },
        { name: "Ev Yemekleri", organization_category_id: 1 },
        { name: "Meyhane", organization_category_id: 1 },
        { name: "Ocakbaşı", organization_category_id: 1 },
        { name: "Fırın & Unlu Mamül", organization_category_id: 1 },
        { name: "Dondurma", organization_category_id: 1 },
        { name: "Diğer", organization_category_id: 1 },

        { name: "Butik Otel", organization_category_id: 2 },
        { name: "Pansiyon", organization_category_id: 2 },
        { name: "Glamping / Kamp Alanı", organization_category_id: 2 },
        { name: "Apart Otel", organization_category_id: 2 },
        { name: "Kiralık Villa", organization_category_id: 2 },
        { name: "Karavan", organization_category_id: 2 },
        { name: "Bungalov", organization_category_id: 2 },

        { name: "Hırdavat & Nalbur", organization_category_id: 3 },
        { name: "Emlak", organization_category_id: 3 },
        { name: "Mimarlık", organization_category_id: 3 },
        { name: "Elektrik & Tesisat", organization_category_id: 3 },
        { name: "Hafriyat & İş Makinesi", organization_category_id: 3 }
    ]);

    await knex.raw('SET FOREIGN_KEY_CHECKS = 1');
};