import { ItemRepository } from "../../../Repository/Organization/Category/Item";
import { Item } from "../../../Entity/Organization/Category/Item";

export class ItemService {
    private repo = new ItemRepository();

    async getByOrganizationCategoryId(id: number) {
        return this.repo.getByOraganizationCategoryId(id);
    }

    async list(): Promise<Item[]> {
        return this.repo.getAll();
    }

    async create(item: Partial<Item>): Promise<void> {
        await this.repo.create(item);
    }

    async del(id: number): Promise<void> {
        await this.repo.del(id);
    }
}
