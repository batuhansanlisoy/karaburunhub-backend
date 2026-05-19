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
        if (!id) return res.status(400).send("Geçersiz Turistik ID'si moruk");

        const place = await service.single(id);

        if (!place) {
            return res.status(404).send("Turistik Bulunamadı!");
        }

        const response = PlaceConverter.toResponse(place);

        res.render("place/detail", {
            title: `${response.name} Detayı`,
            activePage: "place",
            page: "place_detail",
            place: response
        });

    } catch (err) {
        console.error(err);
        res.status(500).send("Turistik detay sayfası yüklenirken hata oluştu");
    }
};

export const list = async (req: Request, res: Response) => {
    const village_id = req.query.village_id ? Number(req.query.village_id) : undefined;
    const ids = req.query.ids ? String(req.query.ids).split(',').map(Number) : undefined;

    try {
        const places: Place[] = await service.list(village_id, ids);
        const response = PlaceConverter.toListResponse(places);

        res.json(response);
    } catch (err) {
        res.status(500).json({ error: err });
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
        return res.status(400).send("Village, Title ve Adress Alanları zorunludur");
    }

    const place: Partial<Place> = {
        village_id, name, content: { explanation, detail },
        address, latitude, longitude
    };

    try {
        const result = await service.create(place);
        res.status(201).json({ success: true, message: "Place Created", result });
    } catch (err: any) {
        console.error(err);
        res.status(500).json({ success: false, message: err.message || "Place could not be created" });
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
        console.error(err);
        res.status(500).json({ message: "Kayıt Güncellenemedi", error: err.message || err});
    }
}

export const uploadPhoto = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);

        const result = await service.handleFileUpload(id, req.files, "place");

        return res.json({ 
            success: true, 
            message: "Fotoğraflar başarıyla yüklendi", 
            data: result 
        });

    } catch (err: any) {
        console.error("Upload Error:", err);
        return res.status(500).json({ 
            message: "Fotoğraflar işlenirken hata oluştu", 
            error: err.message 
        });
    }
}

export const uploadVideo = async (req: Request, res: Response) => {
    try {
        const placeId = Number(req.params.id);
        if (!placeId) return res.status(400).send("Geçersiz ID");
        
        if (!req.file) {
            return res.status(400).json({ message: "Video yüklenemedi." });
        }
    
        await service.handleVideoUpload(placeId, req.file);

        return res.status(200).json({
            success: true,
            message: "Video başarıyla R2'ye yüklendi ve kaydedildi!"
        });

    } catch (error: any) {
        console.error("Video DB Save Controller Error:", error);

        return res.status(500).json({
            message: "Video kaydedilirken hata oluştu",
            error: error.message
        });
    }
};

export const deleteVideo = async (req: Request, res: Response) => {
    try {
        const placeId = Number(req.params.id);
        const { videoPath } = req.body;

        if (!placeId || !videoPath) {
            return res.status(400).json({ message: "Eksik parametre!" });
        }

        await service.deleteVideo(placeId, videoPath);

        return res.status(200).json({
            success: true,
            message: "Video bulut depolama alanı ve veritabanından silindi!"
        });

    } catch (error: any) {
        console.error("Video Delete Controller Error:", error);
        
        return res.status(500).json({ 
            message: "Silme işlemi başarısız.", 
            error: error.message 
        });
    }
};

export const deletePhoto = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const { type, index } = req.body;

    try {
        await service.deleteImage(id, type, index);

        return res.json({ success: true, message: "Başarıyla silindi" });
    } catch (err: any) {
        console.error(err);
        res.status(500).json({ message: "Hata", error: err.message });
    }
};

export const del = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    
    try {
        const status = await service.del(id);
        return res.json({ deletedRows: status });
    } catch (err: any) {
        console.error(err);
        res.status(500).json({ message: "Kayıt Silinemedi", error: err.message || err });
    }
};

export const nearestActivity = async (req: Request, res: Response) => {
    const placeId = Number(req.params.id);

    try {
        const distances = await serviceActivityDistance.list(undefined, placeId);
        res.status(200).json({ distances });
    } catch (err: any) {
        console.error(err);
        res.status(500).json({ error: err.message || err });
    }
}

export const nearestBeaches = async (req: Request, res: Response) => {
    const placeId = Number(req.params.id);

    try {
        const distances = await serviceBeachDistance.list(undefined, placeId);
        res.status(200).json({ distances });
    } catch (err: any) {
        console.error(err);
        res.status(500).json({ error: err.message || err });
    }
}

export const nearestOrganizations = async (req: Request, res: Response) => {
    const placeId = Number(req.params.id);

    try {
        const distances = await serviceOrganizationDistance.list(undefined, placeId);
        res.status(200).json({ distances });
    } catch (err: any) {
        console.error(err);
        res.status(500).json({ error: err.message || err });
    }
}