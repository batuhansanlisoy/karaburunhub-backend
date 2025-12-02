import db from "../db/knex";
import { FileService } from "./File";
import { Place } from "../Entity/Place";
import { PlaceRepository } from "../Repository/Place";

export class PlaceService {
    private repo = new PlaceRepository();

    async single(id: number): Promise<Place> {
        return this.repo.single(id);
    }

    async list(village_id?: number): Promise<Place[]> {
        if (village_id) {
            return this.repo.getByVillageId(village_id);
        }

        return this.repo.getAll();
    }

    async create(place: Partial<Place>): Promise<void> {
        await this.repo.create(place);
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
