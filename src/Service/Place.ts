import db from "../db/knex";
import { FileService } from "./File";
import { Place } from "../Entity/Place";
import { PlaceRepository } from "../Repository/Place";
import { LocationDistanceOrchestrator } from "./Distance";
import path from "path";

export class PlaceService {
    private repo = new PlaceRepository();
    private distanceService = new LocationDistanceOrchestrator

    async single(id: number): Promise<Place> {
        return this.repo.single(id);
    }

    async list(village_id?: number): Promise<Place[]> {
        if (village_id) {
            return this.repo.getByVillageId(village_id);
        }

        return this.repo.getAll();
    }

    async create(place: Partial<Place>): Promise<number[]> {

        const placeIds = await this.repo.create(place);
        const placeId = placeIds[0];

        if (place.latitude != null || place.longitude) {

            this.distanceService.onPlaceCreated(placeId, place.latitude!, place.longitude!);
        }

        return placeIds;
    }

    async upload(id: number, files: any): Promise<any> {
        let cover: { url: string, filename: string, path: string } | undefined;
        let gallery: string[] | undefined;

        if (files?.cover?.[0]) {
            const file = files.cover[0];
            const savedPath = await FileService.saveAndCompress(
                file.buffer, 
                "place", 
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
                FileService.saveAndCompress(f.buffer, "place", id.toString())
            );

            const savedGalleryPaths = await Promise.all(galleryPromises);
            gallery = savedGalleryPaths.map(p => `/${p}`);
        }

        const payload: Partial<Place> = {
            ...(cover && { cover }),
            ...(gallery && { gallery })
        };

        await this.repo.update(id, payload);

        return payload;
    }

    async update(id: number, payload: Partial<Place>): Promise<void> {
        await this.repo.update(id, payload);
    }

    async del(id: number): Promise<void> {

        await db.transaction(async (trx) => {
            const place = await this.repo.single(id);
            
            if (!place) {
                throw new Error("place nesenesi bulunamadı");
            }

            await this.repo.del(id, trx);
        });

        try {
            FileService.deleteFolder(`upload/place/${id}`);
        } catch (error) {
            console.error("Dosya silme hatası:", error);
        }
    }
}
