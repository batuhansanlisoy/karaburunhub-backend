import { PlaceRepository } from "../Repository/Place";
import { Place } from "../Entity/Place";

export class PlaceService {
    private repo = new PlaceRepository();

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
        await this.repo.del(id);
    }
}
