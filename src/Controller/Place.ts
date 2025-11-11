import { Request, Response } from "express";
import { PlaceService } from "../Service/Place";
import { Place } from "../Entity/Place";
import { VillageService } from "../Service/Village";

const service = new PlaceService();
const village_service = new VillageService();

export const show = async (req: Request, res: Response) => {
    
    const villages = await village_service.list();
    res.render("place/index", {
    villages,
    title: "Gezilecek Yerler",
    activePage: "place",
    page: "place"
    });
};

export const list = async (req: Request, res: Response) => {
    try {
        const village_id = req.query.village_id ? Number(req.query.village_id) : undefined;

        const places: Place[] = await service.list(village_id);
        res.json(places);
    } catch (err) {
        res.status(500).json({ error: err });
    }
};

export const create = async (req: Request, res: Response) => {
    try {
        const files: any = req.files;

        const village_id  = Number(req.body.village_id);
        const name        = req.body.name;
        const explanation = req.body.explanation;
        const detail      = req.body.detail;
        const address     = req.body.address;
        const latitude    = req.body.latitude ? parseFloat(req.body.latitude) : null;
        const longitude   = req.body.longitude ? parseFloat(req.body.longitude) : null;
        
        const logo_url = files?.logo_url?.[0]
            ? `/upload/place/${files.logo_url[0].filename}`
            : undefined;

        const gallery: string[] | undefined = files?.['gallery[]']
            ? files['gallery[]'].map((f: any) => `/upload/place/${f.filename}`)
            : undefined;

        if (!village_id || !name || !address) {
            return res.status(400).send("Village, Title ve Adress Alanları zorunludur");
        }

        const place: Partial<Place> = {
            village_id,
            name,
            content: {
                explanation,
                detail
            },
            logo_url,
            gallery,
            address,
            latitude,
            longitude
        };
        await service.create(place);

        res.status(201).send("Place nesnesi oluşturuldu");
    } catch (err) {
        console.error(err);
        res.status(500).send("Place eklenirken hata oluştu");
    }
};

export const del = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const status = await service.del(id);
        return res.json({ deletedRows: status });
    } catch (err: any) {
        console.error(err);
        res.status(500).json({ message: "Kayıt Silinemedi", error: err.message || err });
    }
};
