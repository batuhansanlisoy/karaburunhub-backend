import db from "../db/knex";
import { LocalProducer } from "../Entity/LocalProducer";

export class LocalProducerRepository {
    private tableName = "local_producers";

    async single(id: number): Promise<LocalProducer> {
        const local_producer = await db(this.tableName).where({ id }).first();
        return local_producer;
    }

    async getAll(village_id?: number, highlight?: boolean, is_active?: boolean): Promise<LocalProducer[]> {
        let query = db(this.tableName).select("*");

        if (village_id != null) {
            query = query.where("village_id", village_id);
        }

        if (highlight !== undefined) {
            query = query.where("highlight", highlight);
        }

        if (is_active !== undefined) {
            query = query.where("is_active", is_active);
        }

        return query;
    }

    async create(payload: Partial<LocalProducer>): Promise<number[]> {
        return db(this.tableName).insert(payload);
    }

    async patch(id: number, field: string, value: any): Promise<number> {
        return db(this.tableName)
            .where({ id: id })
            .update({
                [field]: value
        });
    }

    async update(id: number, payload: Partial<LocalProducer>): Promise<number> {
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
