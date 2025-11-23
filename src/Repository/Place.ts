// src/repositories/UserRepository.ts
import db from "../db/knex";
import { Place } from "../Entity/Place";

export class PlaceRepository {
    private tableName = "place";

    async getAll(): Promise<Place[]> {
        return db(this.tableName).select(
            "place.*",
            "villages.name as village_name")
            .leftJoin("villages", "place.village_id", "villages.id");
    }

    async getByVillageId(village_id: number): Promise<Place[]> {
        return db(this.tableName).where("village_id", village_id);
    }

    async create(place: Partial<Place>): Promise<number[]> {
        const dbPlace = {
            ...place,
            gallery: place.gallery ? JSON.stringify(place.gallery) : null
        }
        return db(this.tableName).insert(dbPlace);
    }

    async del(id: number): Promise<number[]> {
        return db(this.tableName).where({ id }).del();
    }
}
