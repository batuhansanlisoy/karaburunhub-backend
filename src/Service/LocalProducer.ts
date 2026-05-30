import db from "../db/knex";
import { FileService } from "./File";
import { LocalProducer } from "../Entity/LocalProducer";
import { LocalProducerRepository } from "../Repository/LocalProducer";
import { BaseService } from "./BaseService";
import { ExploreFeedRepository } from "~/Repository/ExploreFeed";
import { R2Service } from "./R2";
import { ExploreFeed } from "~/Entity/ExploreFeed";

export class LocalProducerService extends BaseService<LocalProducer> {

    constructor() {
        super(new LocalProducerRepository());
    }

    private exploreRepository = new ExploreFeedRepository();

    async single(id: number): Promise<LocalProducer> {
        return this.repo.getById(id);
    }

    async list(village_id?: number, highlight?: boolean, is_active?: boolean): Promise<LocalProducer[]> {
        
        return this.repo.getAll(village_id, highlight, is_active);
    }

    async create(payload: Partial<LocalProducer>): Promise<number[]> {

        const respId = await this.repo.create(payload);
        return respId;
    }

    async update(id: number, payload: Partial<LocalProducer>): Promise<void> {
        await this.repo.update(id, payload);
    }

    async patch(id: number, field: string, value: any): Promise<number> {
        return await this.repo.patch(id, field, value);
    }

    async del(id: number): Promise<void> {
        const localProducer = await this.repo.getById(id);
        
        if (!localProducer) {
            throw new Error("Local Producer not found");
        }

        const r2Folder = `local_producer/videos/${id}/`;

        await db.transaction(async (trx) => {
            await this.repo.del(id, trx);
            await this.exploreRepository.delByTarget("local_producer", localProducer.id, trx);
        });

        await R2Service.deleteFolder(r2Folder);

        try {
            FileService.deleteFolder(`upload/local_producer/${id}`);
        } catch (error) {
            console.error("Locale file deletion error", error);
        }
    }

    async uploadLocalProducerVideo(
        localProducerId: number,
        file: Express.Multer.File,
        shareToExplore?: boolean, // keşfet tablosuna kaydedilsin mi
        description?: string
    ): Promise<void> {
        const videos = await this.handleVideoUpload(localProducerId, file);

        const lastVideo = videos.at(-1);

        if (!lastVideo) {
            throw new Error("Video url not found");
        }

        if (shareToExplore) {
            this.addExplore(localProducerId, lastVideo, description);
        }
    }

    private async addExplore(
        localProducerId: number,
        videoUrl: string,
        description?: string
    ): Promise<void> {
        const localProducer = await this.repo.getById(localProducerId);

        if (!localProducer) {
            throw new Error("Local Producer not found");
        }

        const payload: Partial<ExploreFeed> = {
            item_type: "local_producer",
            item_id: localProducer.id,
            title: localProducer.name,
            explanation: description ?? "",
            target: `local_producer/detail/${localProducer.id}`,
            video_url: videoUrl,
            score: 0
        }

        await this.exploreRepository.create(payload);
    }

    async deleteLocalProducerVideo(
        localProducerId: number,
        videoPath: string
    ): Promise<void> {
        try {
            await this.deleteVideo(localProducerId, videoPath);
    
            const exploreEntity = await this.exploreRepository.findByVideoUrl(videoPath);
    
            if (exploreEntity) {
                await this.exploreRepository.del(exploreEntity.id);
            }
        } catch (error) {
            console.error("An error occured while removing local producer video:", error);
        }
    }
}
