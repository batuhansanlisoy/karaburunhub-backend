import { OrganizationRepository } from "../../Repository/Organization/Organization";
import { Organization } from "../../Entity/Organization/Organization";

export class OrganizationService {
    private repo = new OrganizationRepository();

    async list(category_id?: number): Promise<Organization[]> {
        if (category_id) {

            return this.repo.getByCategoryId(category_id);
        }

        return this.repo.getAll();
    }

    async create(organization: Partial<Organization>): Promise<void> {

        await this.repo.create(organization);
    }

    async del(id: number): Promise<void> {
        await this.repo.del(id);
    }
}
