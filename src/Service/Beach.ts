import db from "../db/knex";
import { FileService } from "./File";
import { Beach } from "../Entity/Beach";
import { BeachRepository } from "../Repository/Beach";

export class BeachService {
    private repo = new BeachRepository();

    async single(id: number): Promise<Beach> {
        return this.repo.getById(id);
    }

    async list(): Promise<Beach[]> {
        return this.repo.getAll();
    }

    async create(beach: Partial<Beach>): Promise<void> {

        await this.repo.create(beach);
    }

    async del(id: number): Promise<void> {

        await db.transaction(async (trx) => {
            const beach = await this.repo.single(id);
            
            if (!beach) throw new Error("Beach nesenesi bulunamadı");

            await this.repo.del(id, trx);

            try {
                if (beach.cover) {
                    FileService.delete(beach.cover.url);
                }

            } catch (error) {
                throw new Error("dosya silme işlemi hatası" + (error as Error).message);
            }
        });
        await this.repo.del(id);
    }
}
