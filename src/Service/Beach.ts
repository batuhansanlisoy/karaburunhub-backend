import { BeachRepository } from "../Repository/Beach";
import { Beach } from "../Entity/Beach";

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

        await this.repo.del(id);
    }
}
