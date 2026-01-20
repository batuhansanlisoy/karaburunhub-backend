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

    res.render("place/form/edit", {
        placeId: id,
        layout: false,
        name: place.name
    });
};

export const uploadForm = async (req: Request, res: Response) => {
    const id = req.params.id;
    res.render("place/form/upload", {
        placeId: id,
        layout: false
    });
};
