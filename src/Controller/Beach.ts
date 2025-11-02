import { Request, Response } from "express";
import { BeachService } from "../Service/Beach";
import { Beach } from "../Entity/Beach";
import { Village } from "../Entity/Village";
import { VillageService } from "../Service/Village";

const service = new BeachService();
const village_service = new VillageService();

export const show = async (req: Request, res: Response) => {

    const villages: Village[] = await village_service.list();

    res.render("beach", {
    villages,
    title: "Plajlar",
    activePage: "beach",
    page: "beach"
    });
};

export const list = async (req: Request, res: Response) => {
    try {
        let beachs: Beach[] = await service.list();
        beachs = beachs.map((b: any) => ({
        ...b,
        content: typeof b.content === "string" ? JSON.parse(b.content) : b.content
        }));

        res.json(beachs);
    } catch (err) {
        console.error(err);
        res.status(500).send("Plaj listesi alınırken hata oluştu");
    }
};

export const create = async (req: Request, res: Response) => {
    try {

        const village_id = Number(req.body.village_id);
        const title = req.body.title;
        const subtitle = req.body.subtitle;
        const address = req.body.address;
        const url = req.body.url;

        if (!village_id || !title || !address) {
            return res.status(400).send("Village, Title ve Adress Alanları zorunludur");
        }

        const beach: Partial<Beach> = {
            village_id,
            content: {
                title,
                subtitle,
                address
            },
            url
        };
        await service.create(beach);

        res.status(201).send(`Plaj '${title}' başarıyla eklendi`);
    } catch (err) {
        console.error(err);
        res.status(500).send("Plaj eklenirken hata oluştu");
    }
};
