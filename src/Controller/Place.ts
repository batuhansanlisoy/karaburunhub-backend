import { Request, Response } from "express";
import { PlaceService } from "../Service/Place";
import { Place } from "../Entity/Place";
import { PlaceConverter } from "../Converter/Place";
import { DistanceActivityPlaceService } from "../Service/Distance/ActivityPlace";
import { DistanceBeachPlaceService } from "../Service/Distance/BeachPlace";
import { DistancePlaceOrganizationService } from "../Service/Distance/PlaceOrganization";

const service = new PlaceService();
const serviceActivityDistance = new DistanceActivityPlaceService();
const serviceBeachDistance = new DistanceBeachPlaceService();
const serviceOrganizationDistance = new DistancePlaceOrganizationService();

export const show = async (req: Request, res: Response) => {
    res.render("place/index", {
    title: "Gezilecek Yerler",
    activePage: "place",
    page: "place"
    });
};

export const detail = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        
        if (!id) {
            return res.status(400).send("Invalid place id");
        }

        const place = await service.single(id);

        if (!place) {
            return res.status(404).send("Place not found");
        }

        const response = PlaceConverter.toResponse(place);

        res.render("place/detail", {
            title: `${response.name} Detayı`,
            activePage: "place",
            page: "place_detail",
            place: response
        });
    } catch (err: any) {
        console.error("Controller//Place detail method error", err);
        res.status(500).json({
            message: "An error occurred while preaparing place detail page",
            error: err?.message || ""
        });
    }
};

export const single = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);

        if (!id) {
            return res.status(400).send("Invalid Place ID");
        }

        const place = await service.single(id);

        if (!place) {
            return res.status(404).send("Place not found");
        }

        const response = PlaceConverter.toResponse(place);

        res.json(response);
    } catch (err: any) {
        console.error("Place single error", err);
        res.status(500).json({
            message: "An error occurred while fethcing the place",
            error: err?.message || ""
        });
    }
};

export const list = async (req: Request, res: Response) => {
    const village_id = req.query.village_id ? Number(req.query.village_id) : undefined;
    const ids = req.query.ids ? String(req.query.ids).split(',').map(Number) : undefined;

    try {
        const places: Place[] = await service.list(village_id, ids);
        const response = PlaceConverter.toListResponse(places);
        res.json(response);
    } catch (err: any) {
        res.status(500).json({
            message: "An error occurred while fetching the place list",
            error: err?.message || ""
        });
    }
};

export const create = async (req: Request, res: Response) => {
    const village_id  = Number(req.body.village_id);
    const name        = req.body.name;
    const explanation = req.body.explanation;
    const detail      = req.body.detail;
    const address     = req.body.address;
    const latitude    = req.body.latitude ? parseFloat(req.body.latitude) : null;
    const longitude   = req.body.longitude ? parseFloat(req.body.longitude) : null;

    if (!village_id || !name || !address) {
        return res.status(400).send("Required fields are missing");
    }

    const place: Partial<Place> = {
        village_id, name, content: { explanation, detail },
        address, latitude, longitude
    };

    try {
        const result = await service.create(place);
        res.status(201).json({
            success: true,
            message: "Place created",
            result
        });
    } catch (err: any) {
        console.error("Controller//Place crate method error", err);
        res.status(500).json({
            success: false,
            message: "An error occurred while creating place",
            error: err?.message || ""
        });
    }
};

export const update = async (req: Request, res: Response) => {
    const id          = Number(req.params.id);
    const village_id  = req.body.village_id;
    const name        = req.body.name;
    const explanation = req.body.explanation;
    const detail      = req.body.detail;
    const address     = req.body.address;
    const latitude    = req.body.latitude ? parseFloat(req.body.latitude) : null;
    const longitude   = req.body.longitude ? parseFloat(req.body.longitude) : null;

    const place: Partial<Place> = {
        name,
        content: {
            explanation: explanation,
            detail: detail
        },
        address,
        latitude,
        longitude,
        village_id
    };

    try {
        const result = await service.update(id, place);
        return res.json({ result });
    } catch(err: any) {
        console.error("Place update error", err);
        res.status(500).json({
            message: "An error occurred while updating place",
            error: err?.message || ""
        });
    }
}

export const uploadPhoto = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);

        const result = await service.handleFileUpload(id, req.files, "place");

        return res.json({ 
            success: true, 
            message: "Photos were saved successfully", 
            data: result 
        });
    } catch (err: any) {
        console.error("Upload Error:", err);
        return res.status(500).json({ 
            message: "An error occurred while saving the photos", 
            error: err?.message || ""
        });
    }
}

export const uploadVideo = async (req: Request, res: Response) => {
    try {
        const placeId = Number(req.params.id);
        const description = req.body.video_description;
        const shareToExplore = req.body.share_to_explore === 'true';

        if (!placeId) {
            return res.status(400).send("Invalid ID");
        } 
        
        if (!req.file) {
            return res.status(400).json({
                message: "Video not uploaded"
            });
        }
    
        await service.uploadPlaceVideo(placeId, req.file, shareToExplore, description);

        const resMessage = shareToExplore
            ? "Video successfully uploaded to cloud storage and added to explore feed"
            : "Video successfully uploaded to cloud storage";

        return res.status(200).json({
            success: true,
            message: resMessage
        });
    } catch (error: any) {
        console.error("Controller//Place uploadVideo method fail", error);
        return res.status(500).json({
            message: "An occurred error while uploading video",
            error: error?.message
        });
    }
};

export const deleteVideo = async (req: Request, res: Response) => {
    try {
        const placeId = Number(req.params.id);
        const { videoPath } = req.body;

        if (!placeId || !videoPath) {
            return res.status(400).json({ message: "Missing Parameter!" });
        }

        await service.deletePlaceVideo(placeId, videoPath);

        return res.status(200).json({
            success: true,
            message: "The video has been deleted from the cloud and the database has been updated."
        });
    } catch (error: any) {
        console.error("Controller//Place deleteVideo method fail", error);
        return res.status(500).json({ 
            message: "Delete video operation failed", 
            error: error?.message 
        });
    }
};

export const deletePhoto = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const { type, index } = req.body;

    try {
        await service.deleteImage(id, type, index);

        return res.json({
            success: true,
            message: "Photo deleted successfully"
        });
    } catch (err: any) {
        console.error(err);
        res.status(500).json({
            message: "Error while deleting photo",
            error: err?.message
        });
    }
};

export const del = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    
    try {
        const status = await service.del(id);
        return res.json({ deletedRows: status });
    } catch (err: any) {
        console.error("Conroller//Place delete method error", err);
        res.status(500).json({
            message: "Couldn't delete record",
            error: err?.message || ""
        });
    }
};

export const nearestActivity = async (req: Request, res: Response) => {
    const placeId = Number(req.params.id);
    const onlyUpcoming = req.query.onlyUpcoming !== undefined ? req.query.onlyUpcoming === 'true' : undefined;

    try {
        const distances = await serviceActivityDistance.list(undefined, placeId, onlyUpcoming);
        res.status(200).json({ distances });
    } catch (err: any) {
        console.error("Controller//Place nearestActivity method error", err);
        res.status(500).json({
            error: err?.message || ""
        });
    }
}

export const nearestBeaches = async (req: Request, res: Response) => {
    const placeId = Number(req.params.id);

    try {
        const distances = await serviceBeachDistance.list(undefined, placeId);
        res.status(200).json({ distances });
    } catch (err: any) {
        console.error("Controller//Place nearestBeaches method error", err);
        res.status(500).json({
            error: err?.message || ""
        });
    }
}

export const nearestOrganizations = async (req: Request, res: Response) => {
    const placeId = Number(req.params.id);

    try {
        const distances = await serviceOrganizationDistance.list(undefined, placeId);
        res.status(200).json({ distances });
    } catch (err: any) {
        console.error("Controller//Place nearestOrganizations method error", err);
        res.status(500).json({
            error: err?.message || ""
        });
    }
}