import db from "../db/knex";
import { BaseService } from "./BaseService";
import { FileService } from "./File";
import { Organization } from "../Entity/Organization";
import { SubcategoryRepository } from "../Repository/Organization/Subcategory";
import { Subcategory } from "../Entity/Organization/Subcategory";
import { OrganizationRepository } from "../Repository/Organization";

export class OrganizationService extends BaseService<Organization>{
    constructor() {
        super(new OrganizationRepository())
    };

    private sub_category_repo = new SubcategoryRepository();

    async single(id: number): Promise<Organization> {

        return this.repo.single(id);
    }

    async list(category_id?: number, village_id?: number, highlight?: boolean): Promise<Organization[]> {
        return this.repo.getAll(category_id, village_id, highlight);
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

    async patch(id: number, field: string, value: any): Promise<number> {
        return await this.repo.patch(id, field, value);
    }
    
    async update(id: number, payload: Partial<Organization>): Promise<void> {
        await this.repo.update(id, payload);
    }

    async upload(id: number, files: any): Promise<any> {
        return await this.handleFileUpload(id, files, "organization");
    }

    async del(id: number): Promise<void> {

        await db.transaction(async (trx) => {
            const org = await this.repo.single(id);

            if (!org) { 
                throw new Error("Organizasyon buluanamadı");
            }

            await this.repo.del(id, trx);
        });

        try {
            FileService.deleteFolder(`upload/organization/${id}`);
        } catch (error) {
            console.error("Dosya silme hatası:", error);
        }
    }
    
}
