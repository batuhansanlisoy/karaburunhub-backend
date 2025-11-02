import { Request, Response } from "express";
import { VillageService } from "../Service/Village";
import { Village } from "../Entity/Village";

const service = new VillageService();

export const list = async (req: Request, res: Response) => {
    try {
        const villages: Village[] = await service.list();
        res.json(villages);
    } catch (err) {
        console.error(err);
        res.status(500).send("Village list error");
    }
};

export const create = async (req: Request, res: Response) => {
    try {
        const name = req.body.name as string;

        if (!name) {
            return res.status(400).send("Village name is required");
        }

        const village: Partial<Village> = { name };
        
        await service.create(village);

        res.send(`Village '${name}' başarıyla eklendi`);
    } catch (err) {
        console.error(err);
        res.status(500).send("Village create error");
    }
};
