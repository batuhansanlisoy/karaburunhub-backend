import { Request, Response } from "express";
import { PlaceService } from "../Service/Place";
import { Place } from "../Entity/Place";

const service = new PlaceService();

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
        const place: Place = req.body;
        await service.create(place);
        res.status(201).json({ message: "User created" });
    } catch (err) {
        res.status(500).json({ error: err });
    }
};
