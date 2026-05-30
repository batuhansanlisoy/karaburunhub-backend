import db from "../db/knex";
import { BaseService } from "./BaseService";
import { FileService } from "./File";
import { Organization } from "../Entity/Organization";
import { SubcategoryRepository } from "../Repository/Organization/Subcategory";
import { Subcategory } from "../Entity/Organization/Subcategory";
import { OrganizationRepository } from "../Repository/Organization";
import { ExploreFeedRepository } from "~/Repository/ExploreFeed";
import { R2Service } from "./R2";
import { ExploreFeed } from "~/Entity/ExploreFeed";

export class OrganizationService extends BaseService<Organization>{
    constructor() {
        super(new OrganizationRepository())
    };

    private sub_category_repo = new SubcategoryRepository();
    private exploreRepository = new ExploreFeedRepository();

    async single(id: number): Promise<Organization | null> {
        const organization: Organization = await this.repo.getById(id);

        if (!organization) return null;

        try {
            const subCategories = await this.sub_category_repo.getAll([organization.id]);

            organization.sub_categories = subCategories;
        } catch (err) {
            console.error(`${id} ID'li işletme için alt kategoriler çekilemedi:`, err);
            organization.sub_categories = [];
        }

        return organization;
    }

    async list(
        category_id?: number,
        village_id?: number,
        highlight?: boolean,
        is_active?: boolean,
        sub_category_info?: boolean,
        ids?: number[]
    ): Promise<Organization[]> {
        const organizations: Organization[] = await this.repo.getAll(
            category_id,
            village_id,
            highlight,
            is_active,
            ids
        );

        if (sub_category_info != null && organizations.length > 0) {
            const orgIds = organizations.map(org => org.id);

            const allSubCategories = await this.sub_category_repo.getAll(orgIds);

            organizations.forEach(org => {
                org.sub_categories = allSubCategories.filter(sc => sc.organization_id === org.id);
            });
        }

        return organizations;
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

    async del(id: number): Promise<void> {
        const organization = await this.repo.getById(id);

        if (!organization) { 
            throw new Error("Organization not found");
        }

        const r2Folder = `organization/videos/${id}/`;

        await db.transaction(async (trx) => {
            await this.repo.del(id, trx);
            await this.exploreRepository.delByTarget("organization", organization.id, trx);
        });

        await R2Service.deleteFolder(r2Folder);

        try {
            FileService.deleteFolder(`upload/organization/${id}`);
        } catch (error) {
            console.error("Locale file deletion error", error);
        }
    }

    async uploadOrganizationVideo(
        organizationId: number,
        file: Express.Multer.File,
        shareToExplore?: boolean, // keşfet tablosuna kaydedilsin mi
        description?: string
    ): Promise<void> {
        const videos = await this.handleVideoUpload(organizationId, file);

        const lastVideo = videos.at(-1);

        if (!lastVideo) {
            throw new Error("Video url not found");
        }

        if (shareToExplore) {
            this.addExplore(organizationId, lastVideo, description);
        }
    }

    private async addExplore(
        organizationId: number,
        videoUrl: string,
        description?: string
    ): Promise<void> {
        const organization = await this.repo.getById(organizationId);

        if (!organization) {
            throw new Error("Organization not found");
        }

        const payload: Partial<ExploreFeed> = {
            item_type: "organization",
            item_id: organization.id,
            title: organization.name,
            explanation: description ?? "",
            target: `organization/detail/${organization.id}`,
            video_url: videoUrl,
            score: 100 // organizasyon standart paket olarak 100 puan veriyorum.
        }

        await this.exploreRepository.create(payload);
    }

    async deleteOrganizationVideo(
        organizationId: number,
        videoPath: string
    ): Promise<void> {
        try {
            await this.deleteVideo(organizationId, videoPath);
    
            const exploreEntity = await this.exploreRepository.findByVideoUrl(videoPath);
    
            if (exploreEntity) {
                await this.exploreRepository.del(exploreEntity.id);
            }
        } catch (error) {
            console.error("An error occured while removing organization video:", error);
        }
    }
}
