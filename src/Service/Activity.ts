import db from "../db/knex";
import { FileService } from "./File";
import { Activity } from "../Entity/Activity";
import { ActivityRepository } from "../Repository/Activity";

export class ActivityService {
    private repo = new ActivityRepository();

    async single(id: number): Promise<Activity> {
        return this.repo.single(id);
    }

    async list(village_id?: number, category_id?: number): Promise<Activity[]> {
        
        return this.repo.getAll(village_id, category_id);
    }

    async create(activity: Partial<Activity>): Promise<void> {
        await this.repo.create(activity);
    }

    async update(id: number, activity: Partial<Activity>): Promise<void> {
        await this.repo.update(id, activity);
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
