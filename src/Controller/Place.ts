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

export const list = async (req: Request, res: Response) => {
    try {
        const village_id = req.query.village_id ? Number(req.query.village_id) : undefined;

        const places: Place[] = await service.list(village_id);
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
    const id = Number(req.params.id);
    const name = req.body.name;

    const place: Partial<Place> = { name };

    try {
        const result = await service.update(id, place);
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
            url: `/upload/place/${id}/${file.filename}`,
            filename: file.filename,
            path: `/upload/place/${id}`
        };
    }

    const gallery: string[] | undefined = files?.['gallery[]']
        ? files['gallery[]'].map((f: any) => `/upload/place/${id}/${f.filename}`)
        : undefined;
    
    const activity: Partial<Place> = { cover, gallery };

    try {
        const result = await service.update(id, activity);
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