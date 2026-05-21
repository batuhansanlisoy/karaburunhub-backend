import db from "../db/knex";
import { BaseService } from "./BaseService";
import { FileService } from "./File";
import { Activity } from "../Entity/Activity";
import { ActivityRepository } from "../Repository/Activity";
import { LocationDistanceOrchestrator } from "./Distance";
import { ExploreFeedRepository } from "~/Repository/ExploreFeed";
import { R2Service } from "./R2";
import { ExploreFeed } from "~/Entity/ExploreFeed";

export class ActivityService extends BaseService<Activity>{
    constructor() {
        super(new ActivityRepository())
    };

    private distanceService = new LocationDistanceOrchestrator();
    private exploreRepository = new ExploreFeedRepository();

    async single(id: number): Promise<Activity> {
        return this.repo.getById(id);
    }

    async list(
        village_id?: number,
        category_id?: number,
        ids?: number[]
    ): Promise<Activity[]> {
        
        return this.repo.getAll(
            village_id,
            category_id,
            ids
        );
    }

    async create(activity: Partial<Activity>): Promise<number[]> {
        
        const activityIds = await this.repo.create(activity);
        const activityId = activityIds[0];

        if (activity.latitude != null || activity.longitude !== null) {

            this.distanceService.onActivityCreated(activityId, activity.latitude!, activity.longitude!);
        }
        
        return activityIds;
    }

    async update(id: number, activity: Partial<Activity>): Promise<void> {
        await this.repo.update(id, activity);
    }

    async del(id: number): Promise<void> {
        const activity = await this.repo.getById(id);
        
        if (!activity) {
            throw new Error("Acitiviy not found")
        }

        const r2Folder = `activity/videos/${id}`;

        await db.transaction(async (trx) => {
            await this.repo.del(id, trx);
            await this.exploreRepository.delByTarget("activity", activity.id, trx);
        });

        await R2Service.deleteFolder(r2Folder);

        try {
            FileService.deleteFolder(`upload/activity/${id}`);
        } catch (error) {
            console.error("Locale file deletion error", error);
        }
    }

    async uploadActivityVideo(
        activityId: number,
        file: Express.Multer.File,
        shareToExplore?: boolean, // keşfet tablosuna kaydedilsin mi
        description?: string
    ): Promise<void> {
        const videos = await this.handleVideoUpload(activityId, file);

        const lastVideo = videos.at(-1);

        if (!lastVideo) {
            throw new Error("Video url not found");
        }

        if (shareToExplore) {
            this.addExplore(activityId, lastVideo, description);
        }
    }

    async deleteActivityVideo(
        activityId: number,
        videoPath: string
    ): Promise<void> {
        try {
            await this.deleteVideo(activityId, videoPath);
    
            const exploreEntity = await this.exploreRepository.findByVideoUrl(videoPath);
    
            if (exploreEntity) {
                await this.exploreRepository.del(exploreEntity.id);
            }
        } catch (error) {
            console.error("An error occured while removing activy video:", error);
        }
    }

    async addExplore(
        activityId: number,
        videoUrl: string,
        description?: string
    ): Promise<void> {
        const activity = await this.repo.getById(activityId);

        if (!activity) {
            throw new Error("Activity not found");
        }

        const payload: Partial<ExploreFeed> = {
            item_type: "activity",
            item_id: activity.id,
            title: description ?? activity.name,
            video_url: videoUrl,
            score: 0
        }

        await this.exploreRepository.create(payload);
    }
}
