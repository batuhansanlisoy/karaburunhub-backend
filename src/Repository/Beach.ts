import db from "../db/knex";
import { Beach } from "../Entity/Beach";

export class BeachRepository {
    private tableName = "beachs";

    async single(id: number): Promise<Beach> {
        const beach = await db(this.tableName).where({ id }).first();
        if (beach?.cover && typeof beach.cover === "string") {
            beach.cover = JSON.parse(beach.cover);
        }
        return beach;
    }

    // async getAll(): Promise<Beach[]> {
    //     return db(this.tableName).select(
    //         "beachs.*",
    //         "villages.name as village_name")
    //         .leftJoin("villages", "beachs.village_id", "villages.id");
    // }

    async getAll(village_id?: number, highlight?: boolean): Promise<Beach[]> {
        let query = db(this.tableName).select("*");

        if (village_id != null) {
            query = query.where("village_id", village_id);
        }

        if (highlight !== undefined) {
            query = query.where("highlight", highlight);
        }

        return query;
    }

    async getById(id: number): Promise<Beach> {
        return db(this.tableName).select(
            "beachs.*",
            "villages.name as village_name")
            .leftJoin("villages", "beachs.village_id", "villages.id")
            .where("beachs.id", id)
            .first();
    }

    async create(beach: Partial<Beach>): Promise<number[]> {
        const dbBeach = {
            ...beach,
            gallery: beach.gallery ? JSON.stringify(beach.gallery) : null
        }
        return db(this.tableName).insert(dbBeach);
    }

    async patch(id: number, field: string, value: any): Promise<number> {
        return db(this.tableName)
            .where({ id: id })
            .update({
                [field]: value
        });
    }

    async update(id: number, payload: Partial<Beach>): Promise<number> {
        const dummy: any = { ...payload };

        if (payload.cover !== undefined) {
            dummy.cover = payload.cover ? JSON.stringify(payload.cover) : null;
        }
        
        if (payload.gallery !== undefined) {
            dummy.gallery = payload.gallery ? JSON.stringify(payload.gallery) : null;
        }

        if (payload.extra !== undefined) {
            const existing = await db(this.tableName).select('extra').where({ id }).first();
            let mergedExtra: Record<string, any> = {};

            if (existing?.extra) {
                try {
                    mergedExtra = JSON.parse(existing.extra);
                } catch (e) {
                    console.warn('Json Extra parse hatası, sıfırdan başlıyoruz', e);
                }
            }

            let newExtra: Record<string, any> = {};
            if (typeof payload.extra === 'string') {
                try {
                    newExtra = JSON.parse(payload.extra);
                } catch (e) {
                    console.warn('Yeni Json Extra parse hatası', e);
                }
            } else if (typeof payload.extra === 'object') {
                newExtra = payload.extra;
            }

            // Merge et
            mergedExtra = { ...mergedExtra, ...newExtra };
            dummy.extra = JSON.stringify(mergedExtra);
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
