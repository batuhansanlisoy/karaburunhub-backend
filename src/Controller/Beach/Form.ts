import { Request, Response } from "express";
import { VillageService } from "~/Service/Village";
import { BeachService } from "~/Service/Beach";

const village_service = new VillageService();
const beach_service = new BeachService();

export const createForm = async (req: Request, res: Response) => {
    const villages = await village_service.list();

    res.render("beach/form/create", {
        villages,
        layout: false
    });
};

export const editForm = async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    const beach = await beach_service.single(id);

    res.render("beach/form/edit", {
        beachId: id,
        layout: false,
        name: beach.name
    });
};

export const uploadForm = async (req: Request, res: Response) => {
    const id = req.params.id;
    res.render("beach/form/upload", {
        beachId: id,
        layout: false
    });
};
