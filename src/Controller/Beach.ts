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

export const single = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        if (!id) return res.status(400).send("Geçersiz plaj ID'si");

        const beach = await service.single(id);

        if (!beach) {
            return res.status(404).send("Plaj bulunamadı");
        }

        const response = BeachConverter.toResponse(beach);

        res.json(beach);
    } catch (err) {
        console.error(err);
        res.status(500).send("Plaj fotoğrafları alınırken hata oluştu");
    }
};

export const list = async (req: Request, res: Response) => {
    const village_id = req.query.village_id ? Number(req.query.village_id) : undefined;
    const highlight = req.query.highlight !== undefined ? req.query.highlight === 'true' : undefined;

    try {
        const beaches: Beach[] = await service.list(village_id, highlight);
        const response = BeachConverter.toListResponse(beaches);

        res.json(response);
    } catch (err) {
        console.error(err);
        res.status(500).send("Plaj listesi alınırken hata oluştu");
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
        return res.status(400).send("Village, Title ve Adress Alanları zorunludur");
    }

    const beach: Partial<Beach> = {
        village_id, name, extra: { explanation }, address, latitude, longitude
    };

    try {
        const result = await service.create(beach);
        res.status(201).json({ success: true, message: "Beach Created", result });
    } catch (err: any) {
        console.error(err);
        res.status(500).json({ success: false, message: err.message || "Beach could not be created" });
    }
};

export const update = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const name = req.body.name;

    const beach: Partial<Beach> = { name };

    try {
        const result = await service.update(id, beach);
        return res.json({ result });
    } catch(err: any) {
        console.error(err);
        res.status(500).json({ message: "Kayıt Güncellenemedi", error: err.message || err});
    }
}

export const uploadPhoto = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    
    const files: any = req.files;
    let cover: {url: string, filename: string, path: string} | undefined;

    if (files && files.cover && files.cover[0]) {
        const file = files.cover[0];

        cover = {
            url: `/upload/beach/${id}/${file.filename}`,
            filename: file.filename,
            path: `/upload/beach/${id}`
        };
    }

    const gallery: string[] | undefined = files?.['gallery[]']
        ? files['gallery[]'].map((f: any) => `/upload/beach/${id}/${f.filename}`)
        : undefined;
    
    const beach: Partial<Beach> = { cover, gallery };

    try {
        const result = await service.update(id, beach);
        return res.json({ result });
    } catch(err: any) {
        console.error(err);
        res.status(500).json({ message: "Kayıt Güncellenemedi", error: err.message || err});
    }
}

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
    const beachId = Number(req.params.id);

    try {
        const distances = await serviceActivityDistance.list(undefined, beachId);
        res.status(200).json({ distances });
    } catch (err: any) {
        console.error(err);
        res.status(500).json({ error: err.message || err });
    }
}

export const nearestPlaces = async (req: Request, res: Response) => {
    const beachId = Number(req.params.id);

    try {
        const distances = await servicePlaceDistance.list(beachId, undefined);
        res.status(200).json({ distances });
    } catch (err: any) {
        console.error(err);
        res.status(500).json({ error: err.message || err });
    }
}

export const nearestOrganizations = async (req: Request, res: Response) => {
    const beachId = Number(req.params.id);

    try {
        const distances = await serviceOrganizationDistance.list(beachId, undefined);
        res.status(200).json({ distances });
    } catch (err: any) {
        console.error(err);
        res.status(500).json({ error: err.message || err });
    }
}

export const highligt = async (req: Request, res: Response) => {
    const beachId = Number(req.params.id);
    const value = req.body.value;

    try {
        const result = await service.patch(beachId, "highlight", value);

        if (result === 0) {
            return res.status(404).json({ 
                success: false, 
                message: "Plaj bulunamadı." 
            });
        }

        const beach = await service.single(beachId);

        return res.status(200).json({ 
            success: true, 
            message: "Öne çıkarma durumu güncellendi.",
            data: beach
        });

    } catch (err: any) {
        console.error(err);
        res.status(500).json({ error: err.message || "Highlight error"})
    }
}
