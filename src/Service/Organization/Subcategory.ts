import { SubcategoryRepository } from "../../Repository/Organization/Subcategory";
import { Subcategory } from "../../Entity/Organization/Subcategory";

export class SubcategoryService {
    private repo = new SubcategoryRepository();

    async list(): Promise<Subcategory[]> {
        return this.repo.getAll();
    }

    async create(subcategory: Partial<Subcategory>): Promise<void> {
        await this.repo.create(subcategory);
    }

    async del(id: number): Promise<void> {
        await this.repo.del(id);
    }
}
