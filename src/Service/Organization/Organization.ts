import db from "../../db/knex";
import { OrganizationRepository } from "../../Repository/Organization/Organization";
import { Organization } from "../../Entity/Organization/Organization";
import { FileService } from "../../Service/File";

export class OrganizationService {
    private repo = new OrganizationRepository();

    async single(id: number): Promise<Organization> {

        return this.repo.single(id);
    }

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
