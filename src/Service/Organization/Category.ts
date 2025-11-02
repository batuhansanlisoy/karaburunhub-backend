import { CategoryRepository } from "../../Repository/Organization/Category";
import { Category } from "../../Entity/Organization/Category";

export class CategoryService {
    private repo = new CategoryRepository();

    async list(): Promise<Category[]> {
        return this.repo.getAll();
    }

    async create(category: Category): Promise<void> {
        await this.repo.create(category);
    }
}
