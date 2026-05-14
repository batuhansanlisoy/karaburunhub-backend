import db from "../db/knex";
import { FileService } from "./File";
import { LocalProducer } from "../Entity/LocalProducer";
import { LocalProducerRepository } from "../Repository/LocalProducer";
import { BaseService } from "./BaseService";
import { LocalProducerPolicy } from "~/Policy/LocalProducer";

export class LocalProducerService extends BaseService<LocalProducer> {

    constructor() {
        super(new LocalProducerRepository());
    }

    async single(id: number): Promise<LocalProducer> {
        return this.repo.getById(id);
    }

    async list(village_id?: number, highlight?: boolean, is_active?: boolean): Promise<LocalProducer[]> {
        
        return this.repo.getAll(village_id, highlight, is_active);
    }

    async create(payload: Partial<LocalProducer>): Promise<number[]> {

        const respId = await this.repo.create(payload);
        return respId;
    }

    async update(id: number, payload: Partial<LocalProducer>): Promise<void> {
        await this.repo.update(id, payload);
    }

    async patch(id: number, field: string, value: any): Promise<number> {
        return await this.repo.patch(id, field, value);
    }

    async del(id: number): Promise<void> {

        await db.transaction(async (trx) => {
            const local_producer = await this.repo.getById(id);
            
            if (!local_producer) {
                throw new Error("Yerel Üretici nesenesi bulunamadı");
            }

            await this.repo.del(id, trx);

        });
        try {
            FileService.deleteFolder(`upload/local_producer/${id}`);
        } catch (error) {
            console.error("Dosya silme hatası:", error);
        }
    }
}
