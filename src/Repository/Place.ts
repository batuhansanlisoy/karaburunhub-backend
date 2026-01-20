// src/repositories/UserRepository.ts
import db from "../db/knex";
import { Place } from "../Entity/Place";

export class PlaceRepository {
    private tableName = "place";

    async single(id: number): Promise<Place> {
        const place = await db(this.tableName).where({ id }).first();

        if (place?.cover && typeof place.cover === "string") {
            place.cover = JSON.parse(place.cover);
        }

        return place;
    }

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

    async update(id: number, payload: Partial<Place>): Promise<number> {
        const dummy: any = { ...payload };

        if (payload.cover !== undefined) {
            dummy.cover = payload.cover ? JSON.stringify(payload.cover) : null;
        }
        
        if (payload.gallery !== undefined) {
            dummy.gallery = payload.gallery ? JSON.stringify(payload.gallery) : null;
        }

        if (payload.content !== undefined) {
            const existing = await db(this.tableName).select('content').where({ id }).first();
            let mergedContent: Record<string, any> = {};

            if (existing?.content) {
                try {
                    mergedContent = JSON.parse(existing.content);
                } catch (e) {
                    console.warn('Content parse hatası, sıfırdan başlıyoruz', e);
                }
            }

            // Yeni gelen content'i object yap
            let newContent: Record<string, any> = {};
            if (typeof payload.content === 'string') {
                try {
                    newContent = JSON.parse(payload.content);
                } catch (e) {
                    console.warn('Yeni content parse hatası', e);
                }
            } else if (typeof payload.content === 'object') {
                newContent = payload.content;
            }

            // Merge et
            mergedContent = { ...mergedContent, ...newContent };
            dummy.content = JSON.stringify(mergedContent);
        }

        // undefined alanları update'ten çıkar
        Object.keys(dummy).forEach(key => {
            if (dummy[key] === undefined) delete dummy[key];
        });

        return db(this.tableName).where({ id }).update(dummy);
    }

    async del(id: number, trx?: any): Promise<number[]> {
        if (trx) {
            return trx(this.tableName).where({ id }).del();
        }
        
        return db(this.tableName).where({id}).del();
    }
}
