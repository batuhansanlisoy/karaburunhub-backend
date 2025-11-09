import { CategoryRepository } from "../../Repository/Organization/Category";
import { Category } from "../../Entity/Organization/Category";

export class CategoryService {
    private repo = new CategoryRepository();

    async list(): Promise<Category[]> {
        return this.repo.getAll();
    }

    async create(category: Partial<Category>): Promise<void> {
        await this.repo.create(category);
    }

    async del(id: number): Promise<void> {
        await this.repo.del(id);
    }
}
