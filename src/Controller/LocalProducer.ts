import { Request, Response } from "express";
import { LocalProducerService } from "../Service/LocalProducer";
import { LocalProducer } from "../Entity/LocalProducer";
import { LocalProducerConverter } from "../Converter/LocalProducer";

const service = new LocalProducerService();

export const show = async (req: Request, res: Response) => {
    res.render("local_producer/index", {
    title: "Yerel Üreticiler",
    activePage: "local_producer",
    page: "local_producer"
    });
};

export const detail = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);

        if (!id) {
            return res.status(400).send("Invalid LocalProducer ID");
        }

        const local_producer = await service.single(id);

        if (!local_producer) {
            return res.status(404).send("Local Producer not found");
        }

        const response = LocalProducerConverter.toResponse(local_producer);

        res.render("local_producer/detail", {
            title: `${response.name} Detayı`,
            activePage: "local_producer",
            page: "local_producer_detail",
            localProducer: response
        });
    } catch (err: any) {
        console.error("Local Producer detail error", err);
        res.status(500).send({
            message: "An error occurred while preparing local producer detail page",
            error: err?.message || ""
        });
    }
};

export const list = async (req: Request, res: Response) => {
    const village_id = req.query.village_id ? Number(req.query.village_id) : undefined;
    const highlight = req.query.highlight !== undefined ? req.query.highlight === 'true' : undefined;
    const is_active = req.query.is_active !== undefined ? req.query.is_active === 'true' : undefined

    try {
        const local_producers: LocalProducer[] = await service.list(
            village_id, highlight, is_active
        );

        const response = LocalProducerConverter.toListResponse(local_producers);

        res.json(response);
    } catch (err: any) {
        console.error("Local Producer list error", err);
        res.status(500).json({
            message: "An error occurred while fetching the local producer list",
            error: err?.message || ""
        });
    }
};

export const create = async (req: Request, res: Response) => {
    const village_id = Number(req.body.village_id);
    const name       = req.body.name;
    const title      = req.body.title;
    const email      = req.body.email ?? "";
    const phone      = req.body.phone;
    const products   = req.body.products ?? [];
    const address    = req.body.address;
    
    if (!village_id || !name || !phone || !address) {
        return res.status(400).send("Required fields are missing");
    }

    const payload: Partial<LocalProducer> = {
        village_id, 
        name, 
        title, 
        email, 
        phone, 
        address,
        extra: { products: products } 
    };

    try {
        const result = await service.create(payload);
        res.status(201).json({
            success: true,
            message: "Local Producer Created",
            result
        });
    } catch (err: any) {
        console.error("Local Producer create error", err);
        res.status(500).json({
            success: false,
            message: "An error occurred while creating local producer",
            error: err?.message || ""
        });
    }
};

export const update = async (req: Request, res: Response) => {
    const id         = Number(req.params.id);
    const name       = req.body.name;
    const title      = req.body.title;
    const email      = req.body.email ?? "";
    const phone      = req.body.phone;
    const address    = req.body.address;
    const village_id = req.body.village_id;

    if (!id) {
        return res.status(400).send("Invalid Local Producer ID");
    }

    const payload: Partial<LocalProducer> = { 
        name, title, village_id, email, phone, address
    };

    try {
        const result = await service.update(id, payload);
        return res.json({ result });
    } catch(err: any) {
        console.error("Local Producer update error", err);
        res.status(500).json({
            message: "An error occurred while updating local producer",
            error: err?.message || ""
        });
    }
}

export const uploadPhoto = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);

        if (!id) {
            return res.status(400).send("Invalid Local Producer ID");
        }

        const result = await service.handleFileUpload(id, req.files, "local_producer");

        return res.json({ 
            success: true, 
            message: "Photos were saved successfully",
            data: result 
        });
    } catch (err: any) {
        console.error("Controller//LocalProducer uploadPhoto error:", err);
        return res.status(500).json({ 
            message: "An error occurred while saving the photos",
            error: err?.message || ""
        });
    }
}

export const uploadVideo = async (req: Request, res: Response) => {
    try {
        const localProducerId = Number(req.params.id);
        const description     = req.body.video_description;
        const shareToExplore  = req.body.share_to_explore === 'true';

        if (!localProducerId) {
            return res.status(400).send("Invalid Local Producer ID");
        }
        
        if (!req.file) {
            return res.status(400).json({
                message: "Video not uploaded"
            });
        }
        
        await service.uploadLocalProducerVideo(localProducerId, req.file, shareToExplore, description);

        const resMessage = shareToExplore
            ? "Video successfully uploaded to cloud storage and added to explore feed"
            : "Video successfully uploaded to cloud storage";

        return res.status(200).json({
            success: true,
            message: resMessage
        });
    } catch (error: any) {
        console.error("Controller//LocalProducer uploadVideo method fail", error);
        return res.status(500).json({
            message: "An error occurred while uploading video",
            error: error?.message || ""
        });
    }
};

export const deleteVideo = async (req: Request, res: Response) => {
    try {
        const localProducerId = Number(req.params.id);
        const { videoPath } = req.body;

        if (!localProducerId || !videoPath) {
            return res.status(400).json({ message: "Missing Parameter" });
        }

        await service.deleteLocalProducerVideo(localProducerId, videoPath);

        return res.status(200).json({
            success: true,
            message: "The video has been deleted from the cloud and the database has been updated."
        });
    } catch (error: any) {
        console.error("Controller//LocalProducer deleteVideo method fail", error);
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
        return res.status(400).send("Invalid LocalProducer ID");
    }

    try {
        await service.deleteImage(id, type, index);

        return res.json({
            success: true,
            message: "Photo deleted successfully"
        });
    } catch (err: any) {
        console.error("LocalProducer deletePhoto method error", err);
        res.status(500).json({
            message: "Error while deleting photo",
            error: err?.message || ""
        });
    }
};

export const del = async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    if (!id) {
        return res.status(400).send("Invalid Local Producer ID");
    }

    try {
        const status = await service.del(id);
        return res.json({ deletedRows: status });
    } catch (err: any) {
        console.error("Local Producer delete method error", err);
        res.status(500).json({
            message: "Couldn't delete local producer",
            error: err?.message || ""
        });
    }
};

export const highlight = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const value = req.body.value;

    if (!id) {
        return res.status(400).send("Invalid Local Producer ID");
    }

    try {
        const result = await service.patch(id, "highlight", value);

        if (result === 0) {
            return res.status(404).json({ 
                success: false, 
                message: "Local Producer not found" 
            });
        }

        const local_producer = await service.single(id);

        return res.status(200).json({
            success: true, 
            message: "Highlight status updated",
            data: local_producer
        });
    } catch (err: any) {
        console.error("Controller//LocalProducer highlight error", err);
        res.status(500).json({
            error: err?.message || ""
        });
    }
}

export const activation = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const value = req.body.value;

    if (!id) {
        return res.status(400).send("Invalid Local Producer ID");
    }

    try {
        const result = await service.patch(id, "is_active", value);

        if (result === 0) {
            return res.status(404).json({ 
                success: false, 
                message: "Local Producer not found" 
            });
        }

        const local_producer = await service.single(id);

        return res.status(200).json({ 
            success: true, 
            message: "Active stae updated",
            data: local_producer
        });
    } catch (err: any) {
        console.error("Controller//LocalProducer activation method error", err);
        res.status(500).json({
            error: err.message || "Activation error"
        })
    }
}
