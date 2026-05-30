import db from "../db/knex";
import { FileService } from "./File";
import { Beach } from "../Entity/Beach";
import { BeachRepository } from "../Repository/Beach";
import { LocationDistanceOrchestrator } from "./Distance";
import { BaseService } from "./BaseService";
import { ExploreFeedRepository } from "~/Repository/ExploreFeed";
import { ExploreFeed } from "~/Entity/ExploreFeed";
import { R2Service } from "./R2";

export class BeachService extends BaseService<Beach> {

    constructor() {
        super(new BeachRepository());
    }

    private distanceService = new LocationDistanceOrchestrator();
    private exploreRepository = new ExploreFeedRepository();

    async single(id: number): Promise<Beach> {
        return this.repo.getById(id);
    }

    async list(
        village_id?: number,
        highlight?: boolean,
        ids?: number[]
    ): Promise<Beach[]> {
        return this.repo.getAll(
            village_id,
            highlight,
            ids
        );
    }

    async create(beach: Partial<Beach>): Promise<number[]> {

        const beachIds = await this.repo.create(beach);
        const beachId = beachIds[0];

        if (beach.latitude != null || beach.longitude !== null) {

            this.distanceService.onBeachCreated(beachId, beach.latitude!, beach.longitude!);
        }

        return beachIds;
    }

    async update(id: number, payload: Partial<Beach>): Promise<void> {
        await this.repo.update(id, payload);
    }

    async patch(id: number, field: string, value: any): Promise<number> {
        return await this.repo.patch(id, field, value);
    }

    /**
     * Burası tamamen beach silme durumunda çalışır
     * 1- Sunucunun kendi içerisindeki bulunan cover gallery fotoğraflarını temizler
     * 2- R2 sunucusunda bulunan videoları varsa bunları temizler
     * 3- Keşfet tablosundaki item_type & item_id ile eşleşen bütün kayıtları siler
     * 4- Kendi tablosundaki kaydını siler 
     * Böylece sistemden tamamen aforoz edilir, Hiçbir kaydı kalmaz
     * @param id Silinecek entitynin benzersiz id' si
     * @returns - Geriye herhangi birşey döndürmez
     */
    async del(id: number): Promise<void> {
        const beach = await this.repo.getById(id);

        if (!beach) {
            throw new Error("Beach not found");
        }

        // r2 deki dosya yolu
        const r2Folder = `beach/videos/${id}/`;
        
        await db.transaction(async (trx) => {
            await this.repo.del(id, trx);
            await this.exploreRepository.delByTarget("beach", beach.id, trx);
        });

        await R2Service.deleteFolder(r2Folder);

        try {
            FileService.deleteFolder(`upload/beach/${id}`);
        } catch (err) {
            console.error("Locale file deletion error", err);
        }
    }

    async uploadBeachVideo(
        beachId: number,
        file: Express.Multer.File,
        shareToExplore?: boolean, // keşfet tablosuna kaydedilsin mi
        description?: string
    ): Promise<void> {
        const videos = await this.handleVideoUpload(beachId, file);

        const lastVideo = videos.at(-1);

        if (!lastVideo) {
            throw new Error("Video url not found");
        }

        if (shareToExplore) {
            this.addExplore(beachId, lastVideo, description);
        }
    }

    async deleteBeachVideo(
        beachId: number,
        videoPath: string
    ): Promise<void> {
        try {
            await this.deleteVideo(beachId, videoPath);
    
            const exploreEntity = await this.exploreRepository.findByVideoUrl(videoPath);
    
            if (exploreEntity) {
                await this.exploreRepository.del(exploreEntity.id);
            }
        } catch (error) {
            console.error("An error occured while removing beach video:", error);
        }
    }

    private async addExplore(
        beachId: number,
        videoUrl: string,
        description?: string
    ): Promise<void> {
        const beach = await this.repo.single(beachId);

        if (!beach) {
            throw new Error("Beach not found");
        }

        const payload: Partial<ExploreFeed> = {
            item_type: "beach",
            item_id: beach.id,
            title: beach.name,
            explanation: description ?? "",
            target: `beach/detail/${beach.id}`,
            video_url: videoUrl,
            score: 0
        }

        await this.exploreRepository.create(payload);
    }
}
