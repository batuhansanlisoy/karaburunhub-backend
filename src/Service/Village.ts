import { VillageRepository } from "../Repository/Village";
import { Village } from "../Entity/Village";

export class VillageService {
    private repo = new VillageRepository();

    async list(): Promise<Village[]> {
        return this.repo.getAll();
    }

    async create(village: Partial<Village>): Promise<void> {
        await this.repo.create(village);
    }

    async del(id: number): Promise<void> {
        await this.repo.del(id);
    }
}
