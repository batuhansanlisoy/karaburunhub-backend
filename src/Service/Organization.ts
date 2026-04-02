import db from "../db/knex";
import { FileService } from "./File";
import { Organization } from "../Entity/Organization";
import { SubcategoryRepository } from "../Repository/Organization/Subcategory";
import { Subcategory } from "../Entity/Organization/Subcategory";
import { OrganizationRepository } from "../Repository/Organization";
import path from "path";

export class OrganizationService {
    private repo = new OrganizationRepository();
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
        let cover: { url: string, filename: string, path: string } | undefined;
        let gallery: string[] | undefined;

        if (files?.cover?.[0]) {
            const file = files.cover[0];
            const savedPath = await FileService.saveAndCompress(
                file.buffer, 
                "organization", 
                id.toString()
            );

            cover = {
                url: `/${savedPath}`,
                filename: path.basename(savedPath),
                path: path.dirname(savedPath)
            };
        }

        if (files?.['gallery[]']?.length > 0) {
            const galleryPromises = files['gallery[]'].map((f: any) =>
                FileService.saveAndCompress(f.buffer, "organization", id.toString())
            );

            const savedGalleryPaths = await Promise.all(galleryPromises);
            gallery = savedGalleryPaths.map(p => `/${p}`);
        }

        const payload: Partial<Organization> = {
            ...(cover && { cover }),
            ...(gallery && { gallery })
        };

        await this.repo.update(id, payload);

        return payload;
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
