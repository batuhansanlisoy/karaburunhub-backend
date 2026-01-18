import db from "../db/knex";
import { FileService } from "./File";
import { Beach } from "../Entity/Beach";
import { BeachRepository } from "../Repository/Beach";
import { LocationDistanceOrchestrator } from "./Distance";

export class BeachService {
    private repo = new BeachRepository();
    private distanceService = new LocationDistanceOrchestrator

    async single(id: number): Promise<Beach> {
        return this.repo.getById(id);
    }

    async list(): Promise<Beach[]> {
        return this.repo.getAll();
    }

    async create(beach: Partial<Beach>): Promise<number[]> {

        const beachIds = await this.repo.create(beach);
        const beachId = beachIds[0];

        if (beach.latitude != null || beach.longitude !== null) {

            this.distanceService.onBeachCreated(beachId, beach.latitude!, beach.longitude!);
        }

        return beachIds;
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
