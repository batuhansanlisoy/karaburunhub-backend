import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
    await knex.raw('SET FOREIGN_KEY_CHECKS = 0');
    await knex("beachs").truncate();

    await knex("beachs").insert([
        { 
            name: "Ardıç Plajı", 
            village_id: 16,
            address: "Mordoğan, Karaburun Yolu, 35970 Karaburun/İzmir",
            highlight: true,
            latitude: 38.52921438596137,
            longitude: 26.61452502849295,
            extra: JSON.stringify({ blue_flag: true, facilities: ["WC", "Soyunma Kabini", "Şezlong"] }),
        },
        { 
            name: "Bodrum Plajı", 
            village_id: 17,
            address: "İskele, Kepez Cd., 35960 Karaburun/İzmir",
            highlight: true,
            latitude: 38.636248171675284,
            longitude: 26.523222015157184,
            extra: JSON.stringify({ blue_flag: true, type: "Çakıl" }),
        },
        { 
            name: "Kuyucak Plajı", 
            village_id: 17,
            address: "İskele, Kuyucak Cd., 35960 Karaburun/İzmirr",
            highlight: true,
            latitude: 38.65029468768532,
            longitude: 26.50739597980075,
            extra: JSON.stringify({ blue_flag: true, quiet: true }),
        },
        { 
            name: "Manal Koyu", 
            village_id: 16,
            address: "Mordoğan, 520. Sk., 35970 Karaburun/İzmir",
            highlight: true,
            latitude: 38.47228685270667,
            longitude: 26.61301995130571,
            extra: JSON.stringify({ wind: "Az", depth: "Sığ" }),
            cover: "manal_kapak.jpg"
        },
        { 
            name: "İncirlikoy", 
            village_id: 17,
            address: "İskele, 35960 Karaburun/İzmir",
            highlight: true,
            latitude: 38.64954321542733,
            longitude: 26.52029137568506,
            extra: JSON.stringify({ aquarium_like: true }),
        }
    ]);

    await knex.raw('SET FOREIGN_KEY_CHECKS = 1');
};