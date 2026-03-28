import { Request, Response } from "express";
import { VillageService } from "~/Service/Village";
import { PlaceService } from "~/Service/Place";

const village_service = new VillageService();
const place_service = new PlaceService();

export const createForm = async (req: Request, res: Response) => {
    const villages = await village_service.list();

    res.render("place/form/create", {
        villages,
        layout: false
    });
};

export const editForm = async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    const place = await place_service.single(id);
    const villages = await village_service.list();

    res.render("place/form/edit", {
        placeId: id,
        layout: false,
        name: place.name,
        explanation: place.content?.explanation,
        detail: place.content?.detail,
        address: place.address,
        latitude: place.latitude,
        longitude: place.longitude,
        village_id: place.village_id,
        villages: villages
    });
};

export const uploadForm = async (req: Request, res: Response) => {
    const id = req.params.id;
    res.render("place/form/upload", {
        placeId: id,
        layout: false
    });
};
