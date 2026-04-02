import db from "../db/knex";
import { FileService } from "./File";
import { Beach } from "../Entity/Beach";
import { BeachRepository } from "../Repository/Beach";
import { LocationDistanceOrchestrator } from "./Distance";
import path from "path";

export class BeachService {
    private repo = new BeachRepository();
    private distanceService = new LocationDistanceOrchestrator

    async single(id: number): Promise<Beach> {
        return this.repo.getById(id);
    }

    async list(village_id?: number, highlight?: boolean): Promise<Beach[]> {
        
        return this.repo.getAll(village_id, highlight);
    }

    async create(beach: Partial<Beach>): Promise<number[]> {

        const beachIds = await this.repo.create(beach);
        const beachId = beachIds[0];

        if (beach.latitude != null || beach.longitude !== null) {

            this.distanceService.onBeachCreated(beachId, beach.latitude!, beach.longitude!);
        }

        return beachIds;
    }

    async upload(id: number, files: any): Promise<any> {
        let cover: { url: string, filename: string, path: string } | undefined;
        let gallery: string[] | undefined;

        if (files?.cover?.[0]) {
            const file = files.cover[0];
            const savedPath = await FileService.saveAndCompress(
                file.buffer, 
                "beach", 
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
                FileService.saveAndCompress(f.buffer, "beach", id.toString())
            );

            const savedGalleryPaths = await Promise.all(galleryPromises);
            gallery = savedGalleryPaths.map(p => `/${p}`);
        }

        const payload: Partial<Beach> = {
            ...(cover && { cover }),
            ...(gallery && { gallery })
        };

        await this.repo.update(id, payload);

        return payload;
    }

    async update(id: number, payload: Partial<Beach>): Promise<void> {
        await this.repo.update(id, payload);
    }

    async patch(id: number, field: string, value: any): Promise<number> {
        return await this.repo.patch(id, field, value);
    }

    async del(id: number): Promise<void> {

        await db.transaction(async (trx) => {
            const beach = await this.repo.single(id);
            
            if (!beach) {
                throw new Error("Beach nesenesi bulunamadı");
            }

            await this.repo.del(id, trx);

        });
        try {
            FileService.deleteFolder(`upload/beach/${id}`);
        } catch (error) {
            console.error("Dosya silme hatası:", error);
        }
    }
}
