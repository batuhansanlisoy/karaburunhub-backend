import { Request, Response } from "express";
import { ActivityService } from "../Service/Activity";
import { Activity } from "../Entity/Activity";
import { ActivityConverter } from "../Converter/Activity";
import { DistanceActivityBeachService } from "../Service/Distance/ActivityBeach";
import { DistanceActivityPlaceService } from "../Service/Distance/ActivityPlace";
import { DistanceActivityOrganizationService } from "../Service/Distance/ActivityOrganization";

const service = new ActivityService();
const serviceBeachDistance = new DistanceActivityBeachService();
const servicePlaceDistance = new DistanceActivityPlaceService();
const serviceOrganizationDistance = new DistanceActivityOrganizationService();

export const show = async (req: Request, res: Response) => {
    res.render("activity/index", {
        title: "Etkinlikler",
        activePage: "activity",
        page: "activity"
    });
};

export const detail = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);

        if (!id) {
            return res.status(400).send("Invalid Activity ID");
        }

        const activity = await service.single(id);

        if (!activity) {
            return res.status(404).send("Activity not found");
        }

        const response = ActivityConverter.toResponse(activity);

        res.render("activity/detail", {
            title: `${response.name} Detayı`,
            activePage: "activity",
            page: "activity_detail",
            activity: response
        });
    } catch (err: any) {
        console.error("Activity detail error", err);

        res.status(500).send({
            message: "An error occurred while preparing activity detail page",
            error: err?.message || ""
        });
    }
};

export const single = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);

        if (!id) {
            return res.status(400).send("Invalid Activty ID");
        }

        const activity = await service.single(id);

        if (!activity) {
            return res.status(404).send("Activity not found");
        }

        const response = ActivityConverter.toResponse(activity);

        res.json(response);
    } catch (err: any) {
        console.error("Activity single error", err);
        res.status(500).json({
            message: "An error occurred while fethcing the activity",
            error: err?.message || ""
        });
    }
};

export const list = async (req: Request, res: Response) => {
    try {
        const village_id  = req.query.village_id ? Number(req.query.village_id) : undefined;
        const category_id = req.query.category_id ? Number(req.query.category_id) : undefined;
        const ids = req.query.ids ? String(req.query.ids).split(',').map(Number) : undefined;

        const activities: Activity[] = await service.list(village_id, category_id, ids);
        const response = ActivityConverter.toListResponse(activities);

        res.json(response);
    } catch (err: any) {
        console.error("Activity list error", err);
        res.status(500).json({
            message: "An error occurred while fetching the activity list",
            error: err?.message || ""
        });
    }
};

export const create = async (req: Request, res: Response) => {
    const category_id = Number(req.body.category_id);
    const village_id  = Number(req.body.village_id);
    const name        = req.body.name;
    const begin       = req.body.begin;
    const end         = req.body.end;
    const explanation = req.body.explanation;
    const address     = req.body.address;
    const latitude    = req.body.latitude ? parseFloat(req.body.latitude) : null;
    const longitude   = req.body.longitude ? parseFloat(req.body.longitude) : null;
        
    if (!village_id || !name || !address) {
        return res.status(400).json({
            success: false,
            message: "Required fileds are missing"
        });
    }

    const activity: Partial<Activity> = {
        category_id, village_id, name, begin, end, content: { explanation },
        address, latitude, longitude
    };

    try {
        const result = await service.create(activity);

        res.status(201).json({
            success: true,
            message: "Activity Created",
            result
        });
    } catch (err: any) {
        console.error("Activity create error", err);
        res.status(500).json({
            success: false,
            message: "An error occurred while creating activity",
            error: err?.message || ""
        });
    }
};

export const update = async (req: Request, res: Response) => {
    const id          = Number(req.params.id);
    const village_id  = req.body.village_id;
    const name        = req.body.name;
    const explanation = req.body.explanation;
    const address     = req.body.address;
    const latitude    = req.body.latitude ? parseFloat(req.body.latitude) : null;
    const longitude   = req.body.longitude ? parseFloat(req.body.longitude) : null;
    const begin       = req.body.begin;
    const end         = req.body.end;

    const activity: Partial<Activity> = {
        name,
        content: {
            explanation: explanation
        },
        latitude,
        longitude,
        address,
        begin,
        end,
        village_id
    };

    try {
        const result = await service.update(id, activity);
        return res.json({ result });
    } catch(err: any) {
        console.error("Activity update error", err);
        res.status(500).json({
            message: "An error occurred while updating activity",
            error: err?.message || ""
        });
    }
}

export const timeline = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const timeline = Array.isArray(req.body.timeline) ? req.body.timeline : [];

    if (!id) {
        return res.status(400).send("Invalid Activity ID");
    }

    try {
        const result = await service.update(id, { content: { timeline } });
        return res.json({ result });
    } catch (err: any) {
        console.error("Controller//Activity timeline method error", err);
        res.status(500).json({
            message: "Activity timeline not updated",
            error: err.message || ""
        });
    }
};

export const uploadPhoto = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);

        if (!id) {
            return res.status(400).send("Invalid Activity ID");
        }

        const result = await service.handleFileUpload(id, req.files, "activity");

        return res.json({ 
            success: true, 
            message: "Photos were saved successfully",
            data: result
        });
    } catch (err: any) {
        console.error("Controller//Activity uploadPhoto error:", err);
        return res.status(500).json({ 
            message: "An error occurred while saving the photos",
            error: err?.message || "" 
        });
    }
}

export const uploadVideo = async (req: Request, res: Response) => {
    try {
        const activityId = Number(req.params.id);
        const description = req.body.video_description;
        const shareToExplore = req.body.share_to_explore === 'true';

        if (!activityId) {
            return res.status(400).send("Geçersiz Etkinlik ID'si");
        }
        
        if (!req.file) {
            return res.status(400).json({
                message: "Video yüklenemedi."
            });
        }
        
        await service.uploadActivityVideo(activityId, req.file, shareToExplore, description);

        const resMessage = shareToExplore
            ? "Video successfully uploaded to cloud storage and added to explore feed"
            : "Video successfully uploaded to cloud storage";

        return res.status(200).json({
            success: true,
            message: resMessage
        });
    } catch (error: any) {
        console.error("Controller//Activity uploadVideo method fail", error);
        return res.status(500).json({
            message: "An error occurred while uploading video",
            error: error?.message || ""
        });
    }
};

export const deleteVideo = async (req: Request, res: Response) => {
    try {
        const activityId = Number(req.params.id);
        const { videoPath } = req.body;

        if (!activityId || !videoPath) {
            return res.status(400).json({ message: "Missing parameter" });
        }

        await service.deleteActivityVideo(activityId, videoPath);

        return res.status(200).json({
            success: true,
            message: "The video has been deleted from the cloud and the database has been updated."
        });
    } catch (error: any) {
        console.error("Controller//Activity deleteVideo method fail", error);
        return res.status(500).json({ 
            message: "Delete video operation failed", 
            error: error?.message || ""
        });
    }
};

export const deletePhoto = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const { type, index } = req.body;

    if (!id) {
        return res.status(400).send("Invalid Activity ID");
    }

    try {
        await service.deleteImage(id, type, index);

        return res.json({
            success: true,
            message: "Photo deleted successfully"
        });
    } catch (err: any) {
        console.error("Activity deletePhoto method error", err);
        res.status(500).json({
            message: "Error while deleting photo",
            error: err?.message || ""
        });
    }
};

export const del = async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    if (!id) {
        return res.status(400).send("Invalid Activity ID");
    }

    try {
        const status = await service.del(id);
        return res.json({ deletedRows: status });
    } catch (err: any) {
        console.error("Activity delete method error", err);
        res.status(500).json({
            message: "Couldn't delete activity",
            error: err?.message || ""
        });
    }
};

export const nearestBeaches = async (req: Request, res: Response) => {
    const activityId = Number(req.params.id);

    if (!activityId) {
        return res.status(400).send("Invalid Activity ID");
    }

    try {
        const distances = await serviceBeachDistance.list(activityId, undefined);
        res.status(200).json({ distances });
    } catch (err: any) {
        console.error("Controller//Activity nearestBeaches method error", err);
        res.status(500).json({
            error: err.message || ""
        });
    }
}

export const nearestPlaces = async (req: Request, res: Response) => {
    const activityId = Number(req.params.id);

    if (!activityId) {
        return res.status(400).send("Invalid Activity ID");
    }

    try {
        const distances = await servicePlaceDistance.list(activityId, undefined);
        res.status(200).json({ distances });
    } catch (err: any) {
        console.error("Controller//Activity nearestPlaces method error", err);
        res.status(500).json({
            error: err.message || ""
        });
    }
}

export const nearestOrganizations = async (req: Request, res: Response) => {
    const activityId = Number(req.params.id);

    if (!activityId) {
        return res.status(400).send("Invalid Activity ID");
    }

    try {
        const distances = await serviceOrganizationDistance.list(activityId, undefined);
        res.status(200).json({ distances });
    } catch (err: any) {
        console.error("Controller//Activity nearestOrganizations method error", err);
        res.status(500).json({
            error: err.message || ""
        });
    }
}