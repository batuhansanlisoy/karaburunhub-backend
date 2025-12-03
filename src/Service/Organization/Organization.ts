import db from "../../db/knex";
import { FileService } from "../../Service/File";
import { Organization } from "../../Entity/Organization/Organization";
import { SubcategoryRepository } from "../../Repository/Organization/Subcategory";
import { Subcategory } from "../../Entity/Organization/Subcategory";
import { OrganizationRepository } from "../../Repository/Organization/Organization";

export class OrganizationService {
    private repo = new OrganizationRepository();
    private sub_category_repo = new SubcategoryRepository();

    async single(id: number): Promise<Organization> {

        return this.repo.single(id);
    }

    async list(category_id?: number): Promise<Organization[]> {
        if (category_id) {

            return this.repo.getByCategoryId(category_id);
        }

        return this.repo.getAll();
    }

    async create(organization: Partial<Organization>, items: number[]): Promise<void> {

        await db.transaction(async (trx) => {
            const [organization_id] = await this.repo.create(organization, trx);

            for (const  item_id of items) {
                const sub_category: Partial<Subcategory> = {
                    item_id, organization_id
                };

                await this.sub_category_repo.create(sub_category, trx);
            }
        });
    }

    async del(id: number): Promise<void> {

        await db.transaction(async (trx) => {
            const org = await this.repo.single(id);
            console.log(org);
            if (!org) throw new Error("Organizasyon buluanamadı");

            await this.repo.del(id, trx);

            try {
                if (org.cover) {

                    FileService.delete(org.cover.url);
                }
            } catch (error) {
                throw new Error("dosya silme hatası" + (error as Error).message);
            }
        });
    }
    
}
