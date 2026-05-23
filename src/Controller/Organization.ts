import { Request, Response } from "express";
import { Organization } from "../Entity/Organization";
import { OrganizationService } from "../Service/Organization";
import { Organization as Converter } from "../Converter/Organization";
import { DistanceActivityOrganizationService } from "../Service/Distance/ActivityOrganization";
import { DistanceBeachOrganizationService } from "../Service/Distance/BeachOrganization";
import { DistancePlaceOrganizationService } from "../Service/Distance/PlaceOrganization";

const service = new OrganizationService();
const serviceActivityDistance = new DistanceActivityOrganizationService();
const serviceBeachDistance = new DistanceBeachOrganizationService();
const servicePlaceDistance = new DistancePlaceOrganizationService();

export const show = async (req: Request, res: Response) => {
    res.render("organization/index", {
        title: "İşletmeler",
        activePage: "organization",
        page: "organization"
    });
};

export const detail = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);

        if (!id) {
            return res.status(400).send("Invalid Organization ID");
        }

        const organization = await service.single(id);

        if (!organization) {
            return res.status(404).send("İşletme Bulunamadı!");
        }

        const response = Converter.toResponse(organization);

        res.render("organization/detail", {
            title: `${response.name} Detayı`,
            activePage: "organization",
            page: "organization",
            organization: response
        });
    } catch (err: any) {
        console.error("Organization detail error", err);
        res.status(500).send({
            message: "An error occurred while preparing organization detail page",
            error: err?.message || ""
        });
    }
};

export const single = async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    if (!id) {
        return res.status(400).send("Invalid Organization ID");
    }

    try {
        const organization = await service.single(id);

        if (!organization) {
            return res.status(404).json({ 
                success: false,
                message: "Organization not found" 
            });
        }

        const response = Converter.toResponse(organization); 

        res.json(response);
    } catch (err: any) {
        console.error("Organization single error", err);
        res.status(500).json({
            message: "An error occurred while fethcing the organization",
            error: err?.message || ""
        });
    }
};

export const list = async (req: Request, res: Response) => {
    const category_id = req.query.category_id ? Number(req.query.category_id) : undefined;
    const village_id  = req.query.village_id ? Number(req.query.village_id) : undefined;
    const highlight = req.query.highlight !== undefined ? req.query.highlight === 'true' : undefined;
    const is_active = req.query.is_active !== undefined ? req.query.is_active === 'true' : undefined;
    const sub_category_info = req.query.sub_category_info !== undefined ? req.query.sub_category_info === 'true' : undefined;
    const ids = req.query.ids ? String(req.query.ids).split(',').map(Number) : undefined;

    try {
        const organizations: Organization[] = await service.list(
            category_id, village_id, highlight, is_active, sub_category_info, ids
        );

        const responce = Converter.toListResponse(organizations);
        res.json(responce);
    } catch (err: any) {
        console.error("Organization list error", err);
        res.status(500).json({
            message: "An error occurred while fetching the organization list",
            error: err?.message || ""
        });
    }
};

export const create = async (req: Request, res: Response) => {
    const category_id     = req.body.category_id;
    const village_id      = req.body.village_id;
    const name            = req.body.name;
    const email           = req.body.email;
    const phone           = req.body.phone;
    const address         = req.body.address;
    const website         = req.body.website;
    const description     = req.body.description;
    const has_delivery    = req.body.has_delivery;
    const has_wifi        = req.body.has_wifi;
    const payment_methods = req.body.payment_methods;
    const latitude        = req.body.latitude ? parseFloat(req.body.latitude) : null;
    const longitude       = req.body.longitude ? parseFloat(req.body.longitude) : null;
    const items           = req.body.item_ids;

    if (!name || !address) {
        return res.status(400).send("Required fields are missing");
    }

    const organization: Partial<Organization> = {
        category_id,
        village_id,
        name,
        email,
        phone,
        content: {
            description,
            has_delivery,
            has_wifi,
            payment_methods
        },
        address,
        website,
        latitude,
        longitude
    };

    try {
        const result = await service.create(organization, items);
        res.status(201).json({
            success: true,
            message: "Organization Created",
            result
        });
    } catch (err: any) {
        console.error("Organization create error", err);
        res.status(500).json({
            success: false,
            message: "An error occurred while creating organization",
            error: err?.message || ""
        });
    }
};

export const update = async (req: Request, res: Response) => {
    const id          = Number(req.params.id);
    const category_id = req.body.category_id;
    const village_id  = req.body.village_id;
    const name        = req.body.name;
    const email       = req.body.email;
    const phone       = req.body.phone;
    const address     = req.body.address;
    const website     = req.body.website;
    const latitude    = req.body.latitude ? parseFloat(req.body.latitude) : null;
    const longitude   = req.body.longitude ? parseFloat(req.body.longitude) : null;

    if (!id) {
        return res.status(400).send("Invalid Organization ID");
    }

    const organization: Partial<Organization> = { 
        category_id, village_id, name, email,
        phone, address, website, latitude, longitude
    };

    try {
        const result = await service.update(id, organization);
        return res.json({ result });
    } catch(err: any) {
        console.error("Organization update error", err);
        res.status(500).json({
            message: "An error occurred while updating organization",
            error: err?.message || ""
        });
    }
}

export const highligt = async (req: Request, res: Response) => {
    const organization_id = Number(req.params.id);
    const value = req.body.value;

    if (!organization_id) {
        return res.status(400).send("Invalid Organization ID");
    }

    try {
        const result = await service.patch(organization_id, "highlight", value);

        if (result === 0) {
            return res.status(404).json({ 
                success: false, 
                message: "Organization not found" 
            });
        }

        const organization = await service.single(organization_id);

        return res.status(200).json({ 
            success: true, 
            message: "Highlight status updated",
            data: organization
        });
    } catch (err: any) {
        console.error("Controller//Organizaiton highlight error", err);
        res.status(500).json({
            error: err?.message || ""
        });
    }
}

export const uploadPhoto = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);

        if (!id) {
            return res.status(400).send("Invalid Organization ID");
        }

        const result = await service.handleFileUpload(id, req.files, "organization");

        return res.json({ 
            success: true, 
            message: "Photos were saved successfully",
            data: result 
        });
    } catch (err: any) {
        console.error("Controller//Organization uploadPhoto error:", err);
        return res.status(500).json({ 
            message: "An error occurred while saving the photos",
            error: err?.message || ""
        });
    }
}

export const uploadVideo = async (req: Request, res: Response) => {
    try {
        const organizationId = Number(req.params.id);
        const description    = req.body.video_description;
        const shareToExplore = req.body.share_to_explore === 'true';

        if (!organizationId) {
            return res.status(400).send("Invalid Organization ID");
        }
        
        if (!req.file) {
            return res.status(400).json({
                message: "Video not uploaded"
            });
        }
    
        await service.uploadOrganizationVideo(organizationId, req.file, shareToExplore, description);

        const resMessage = shareToExplore
            ? "Video successfully uploaded to cloud storage and added to explore feed"
            : "Video successfully uploaded to cloud storage";

        return res.status(200).json({
            success: true,
            message: resMessage
        });
    } catch (error: any) {
        console.error("Controller//Organization uploadVideo method fail", error);
        return res.status(500).json({
            message: "An error occurred while uploading video",
            error: error?.message || ""
        });
    }
};

export const deleteVideo = async (req: Request, res: Response) => {
    try {
        const organizationId = Number(req.params.id);
        const { videoPath } = req.body;

        if (!organizationId || !videoPath) {
            return res.status(400).json({ message: "Eksik parametre!" });
        }

        await service.deleteOrganizationVideo(organizationId, videoPath);

        return res.status(200).json({
            success: true,
            message: "The video has been deleted from the cloud and the database has been updated."
        });
    } catch (error: any) {
        console.error("Controller//Organization deleteVideo method fail", error);
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
        return res.status(400).send("Invalid Organization ID");
    }

    try {
        await service.deleteImage(id, type, index);

        return res.json({
            success: true,
            message: "Photo deleted successfully"
        });
    } catch (err: any) {
        console.error("Organization deletePhoto method error", err);
        res.status(500).json({
            message: "Error while deleting photo",
            error: err?.message || ""
        });
    }
};

export const del = async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    if (!id) {
        return res.status(400).send("Invalid Organization ID");
    }

    try {
        const status = await service.del(id);
        return res.json({ deletedRows: status });
    } catch (err: any) {
        console.error("Organization delete method error", err);
        res.status(500).json({
            message: "Couldn't delete organization",
            error: err?.message || ""
        });
    }
};

export const nearestActivity = async (req: Request, res: Response) => {
    const organizationId = Number(req.params.id);

    if (!organizationId) {
        return res.status(400).send("Invalid Organization ID");
    }

    try {
        const distances = await serviceActivityDistance.list(undefined, organizationId);
        res.status(200).json({ distances });
    } catch (err: any) {
        console.error("Controller//Organization nearestActivity method error", err);
        res.status(500).json({
            error: err?.message || ""
        });
    }
}

export const nearestBeaches = async (req: Request, res: Response) => {
    const organizationId = Number(req.params.id);

    if (!organizationId) {
        return res.status(400).send("Invalid Organization ID");
    }

    try {
        const distances = await serviceBeachDistance.list(undefined, organizationId);
        res.status(200).json({ distances });
    } catch (err: any) {
        console.error("Controller//Organization nearestBeaches method error", err);
        res.status(500).json({
            error: err?.message || ""
        });
    }
}

export const nearestPlaces = async (req: Request, res: Response) => {
    const organizationId = Number(req.params.id);

    if (!organizationId) {
        return res.status(400).send("Invalid Organization ID");
    }

    try {
        const distances = await servicePlaceDistance.list(organizationId, undefined);
        res.status(200).json({ distances });
    } catch (err: any) {
        console.error("Controller//Organization nearestPlaces method error", err);
        res.status(500).json({
            error: err?.message || ""
        });
    }
}

export const activation = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const value = req.body.value;

    if (!id) {
        return res.status(400).send("Invalid Organization ID");
    }

    try {
        const result = await service.patch(id, "is_active", value);

        if (result === 0) {
            return res.status(404).json({ 
                success: false, 
                message: "Organization not found" 
            });
        }

        const organization = await service.single(id);

        return res.status(200).json({ 
            success: true, 
            message: "Active state updated",
            data: organization
        });
    } catch (err: any) {
        console.error("Controller//Organization activation error", err);
        res.status(500).json({
            error: err?.message || "Activation error"
        });
    }
}