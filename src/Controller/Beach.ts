import { Request, Response } from "express";
import { BeachService } from "../Service/Beach";
import { Beach } from "../Entity/Beach";
import { BeachConverter } from "../Converter/Beach";
import { DistanceActivityBeachService } from "../Service/Distance/ActivityBeach";
import { DistanceBeachOrganizationService } from "../Service/Distance/BeachOrganization";
import { DistanceBeachPlaceService } from "../Service/Distance/BeachPlace";

const service = new BeachService();
const serviceActivityDistance = new DistanceActivityBeachService();
const serviceOrganizationDistance = new DistanceBeachOrganizationService();
const servicePlaceDistance = new DistanceBeachPlaceService();

export const show = async (req: Request, res: Response) => {
    res.render("beach/index", {
    title: "Plajlar",
    activePage: "beach",
    page: "beach"
    });
};

export const detail = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        if (!id) return res.status(400).send("Invalic Beach ID");

        const beach = await service.single(id);

        if (!beach) {
            return res.status(404).send("Beach not found");
        }

        const response = BeachConverter.toResponse(beach);

        res.render("beach/detail", {
            title: `${response.name} Detayı`,
            activePage: "beach",
            page: "beach_detail",
            beach: response,
            r2PublicUrl: process.env.R2_PUBLIC_URL
        });
    } catch (err: any) {
        console.error("Beach detail error", err);
        res.status(500).send({
            message: "An error occurred while preparing beach detail page",
            error: err?.message || ""
        });
    }
};

export const single = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);

        if (!id) {
            return res.status(400).send("Invalid Beach ID");
        }

        const beach = await service.single(id);

        if (!beach) {
            return res.status(404).send("Beach not found");
        }

        const response = BeachConverter.toResponse(beach);

        res.json(response);
    } catch (err: any) {
        console.error("Beach single error", err);
        res.status(500).json({
            message: "An error occurred while fethcing the beach",
            error: err?.message || ""
        });
    }
};

export const list = async (req: Request, res: Response) => {
    const village_id = req.query.village_id ? Number(req.query.village_id) : undefined;
    const highlight = req.query.highlight !== undefined ? req.query.highlight === 'true' : undefined;
    const ids = req.query.ids ? String(req.query.ids).split(',').map(Number) : undefined;

    try {
        const beaches: Beach[] = await service.list(village_id, highlight, ids);
        const response = BeachConverter.toListResponse(beaches);

        res.json(response);
    } catch (err: any) {
        console.error("Beach list error", err);
        res.status(500).json({
            message: "An error occurred while fetching the beach list",
            error: err?.message || ""
        });
    }
};

export const create = async (req: Request, res: Response) => {
    const village_id  = Number(req.body.village_id);
    const name        = req.body.name;
    const explanation = req.body.explanation;
    const address     = req.body.address;
    const latitude    = req.body.latitude ? parseFloat(req.body.latitude) : null;
    const longitude   = req.body.longitude ? parseFloat(req.body.longitude) : null;

    if (!village_id || !name || !address) {
        return res.status(400).send("Required fields are missing");
    }

    const beach: Partial<Beach> = {
        village_id, name, extra: { explanation }, address, latitude, longitude
    };

    try {
        const result = await service.create(beach);

        res.status(201).json({
            success: true,
            message: "Beach Created",
            result
        });
    } catch (err: any) {
        console.error("Beach create error", err);
        res.status(500).json({
            success: false,
            message: "An error occurred while creating beach",
            error: err?.message || ""
        });
    }
};

export const update = async (req: Request, res: Response) => {
    const id        = Number(req.params.id);
    const name      = req.body.name;
    const address   = req.body.address;
    const latitude  = req.body.latitude ? parseFloat(req.body.latitude) : null;
    const longitude = req.body.longitude ? parseFloat(req.body.longitude) : null;
    
    if (!id) {
        return res.status(400).send("Invalid Beach ID");
    }

    const beach: Partial<Beach> = { name, latitude, longitude, address };

    try {
        const result = await service.update(id, beach);
        return res.json({ result });
    } catch(err: any) {
        console.error("Beach update error", err);
        res.status(500).json({
            message: "An error occurred while updating beach",
            error: err?.message || ""
        });
    }
}

export const uploadPhoto = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);

        if (!id) {
            return res.status(400).send("Invalid Beach ID");
        }

        const result = await service.handleFileUpload(id, req.files, "beach");

        return res.json({ 
            success: true, 
            message: "Photos were saved successfully",
            data: result 
        });
    } catch (err: any) {
        console.error("Controller//Beach uploadPhoto error:", err);
        return res.status(500).json({ 
            message: "An error occurred while saving the photos",
            error: err?.message || ""
        });
    }
}

export const uploadVideo = async (req: Request, res: Response) => {
    try {
        const beachId        = Number(req.params.id);
        const description    = req.body.video_description;
        const shareToExplore = req.body.share_to_explore === 'true';

        if (!beachId) {
            return res.status(400).send("Invalid Beac ID");
        } 
        
        if (!req.file) {
            return res.status(400).json({
                message: "Video not uploaded"
            });
        }
        
        await service.uploadBeachVideo(beachId, req.file, shareToExplore, description);

        const resMessage = shareToExplore
            ? "Video successfully uploaded to cloud storage and added to explore feed"
            : "Video successfully uploaded to cloud storage";

        return res.status(200).json({
            success: true,
            message: resMessage
        });
    } catch (error: any) {
        console.error("Controller//Beach uploadVideo method fail", error);

        return res.status(500).json({
            message: "An error occurred while uploading video",
            error: error?.message || ""
        });
    }
};

export const deleteVideo = async(req: Request, res: Response) => {
    try {
        const beachId = Number(req.params.id);
        const { videoPath } = req.body;

        if (!beachId || !videoPath) {
            return res.status(400).json({ message: "Missing Parameter!" });
        }

        await service.deleteBeachVideo(beachId, videoPath);

        return res.status(200).json({
            success: true,
            message: "The video has been deleted from the cloud and the database has been updated."
        });
    } catch (error: any) {
        console.error("Controller//Beach deleteVideo method fail", error);
        
        return res.status(500).json({ 
            message: "Delete video operation failed", 
            error: error?.message || ""
        });
    }
}

export const deletePhoto = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const { type, index } = req.body;

    if (!id) {
        return res.status(400).send("Invalid Beach ID");
    }

    try {
        await service.deleteImage(id, type, index);

        return res.json({
            success: true,
            message: "Photo deleted successfully"
        });
    } catch (err: any) {
        console.error("Beach deletePhoto method error", err);
        res.status(500).json({
            message: "Error while deleting photo",
            error: err?.message || ""
        });
    }
};

export const del = async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    if (!id) {
        return res.status(400).send("Invalid Beach ID");
    }

    try {
        const status = await service.del(id);
        return res.json({ deletedRows: status });
    } catch (err: any) {
        console.error("Beach delete method error", err);
        res.status(500).json({
            message: "Couldn't delete beach",
            error: err?.message || ""
        });
    }
};

export const nearestActivity = async (req: Request, res: Response) => {
    const beachId = Number(req.params.id);

    if (!beachId) {
        return res.status(400).send("Invalid Beach ID");
    }

    try {
        const distances = await serviceActivityDistance.list(undefined, beachId);
        res.status(200).json({ distances });
    } catch (err: any) {
        console.error("Controller//Beach nearestActivity method error", err);
        res.status(500).json({
            error: err?.message || ""
        });
    }
}

export const nearestPlaces = async (req: Request, res: Response) => {
    const beachId = Number(req.params.id);

    if (!beachId) {
        return res.status(400).send("Invalid Beach ID");
    }

    try {
        const distances = await servicePlaceDistance.list(beachId, undefined);
        res.status(200).json({ distances });
    } catch (err: any) {
        console.error("Controller//Beach nearestPlaces method error", err);
        res.status(500).json({
            error: err?.message || ""
        });
    }
}

export const nearestOrganizations = async (req: Request, res: Response) => {
    const beachId = Number(req.params.id);

    if (!beachId) {
        return res.status(400).send("Invalid Beach ID");
    }

    try {
        const distances = await serviceOrganizationDistance.list(beachId, undefined);
        res.status(200).json({ distances });
    } catch (err: any) {
        console.error("Controller//Beach nearestOrganizations error", err);
        res.status(500).json({
            error: err?.message || ""
        });
    }
}

export const highligt = async (req: Request, res: Response) => {
    const beachId = Number(req.params.id);
    const value = req.body.value;

    if (!beachId) {
        return res.status(400).send("Invalid Beach ID");
    }

    try {
        const result = await service.patch(beachId, "highlight", value);

        if (result === 0) {
            return res.status(404).json({ 
                success: false, 
                message: "Beach not found" 
            });
        }

        const beach = await service.single(beachId);

        return res.status(200).json({ 
            success: true, 
            message: "Highlight status updated",
            data: beach
        });
    } catch (err: any) {
        console.error("Controller//Beach highlight error", err);
        res.status(500).json({
            error: err?.message || ""
        });
    }
}
