import { Request, Response } from "express";
import { EventService } from "../Service/Event";
import { Event } from "../Entity/Event";
import { VillageService } from "../Service/Village";

const service = new EventService();
const village_service = new VillageService();

export const show = async (req: Request, res: Response) => {

    const villages = await village_service.list();

    res.render("event/index", {
    villages,
    title: "Etkinlikler",
    activePage: "event",
    page: "event"
    });
};

export const list = async (req: Request, res: Response) => {
    try {
        const village_id = req.query.village_id ? Number(req.query.village_id) : undefined;

        const events: Event[] = await service.list(village_id);
        res.json(events);
    } catch (err) {
        res.status(500).json({ error: err });
    }
};

export const create = async (req: Request, res: Response) => {
    try {

        const village_id  = Number(req.body.village_id);
        const name        = req.body.name;
        const begin       = req.body.begin;
        const end         = req.body.end;
        const explanation = req.body.explanation;
        const gallery     = req.body.logo_url ?? null;
        const address     = req.body.address;
        const latitude    = req.body.latitude ? parseFloat(req.body.latitude) : null;
        const longitude   = req.body.longitude ? parseFloat(req.body.longitude) : null;
        const logo_url    = req.file ? `/uploads/event/${req.file.filename}` : undefined;

        if (!village_id || !name || !address) {
            return res.status(400).send("Zorunlu alanları doldurunuz");
        }

        const event: Partial<Event> = {
            village_id,
            name,
            begin,
            end,
            content: {
                explanation,
            },
            logo_url,
            gallery,
            address,
            latitude,
            longitude
        };
        await service.create(event);

        res.status(201).send("Event nesnesi oluşturuldu");
    } catch (err) {
        console.error(err);
        res.status(500).send("Event eklenirken hata oluştu");
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
