import { Request, Response } from "express";
import { BeachService } from "../Service/Beach";
import { Beach } from "../Entity/Beach";
import { Village } from "../Entity/Village";
import { VillageService } from "../Service/Village";

const service = new BeachService();
const village_service = new VillageService();

export const show = async (req: Request, res: Response) => {

    const villages: Village[] = await village_service.list();

    res.render("beach/index", {
    villages,
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

        if (!beach) return res.status(404).send("Plaj bulunamadı");

        res.json(beach);
    } catch (err) {
        console.error(err);
        res.status(500).send("Plaj fotoğrafları alınırken hata oluştu");
    }
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

        const files: any = req.files;

        const village_id  = Number(req.body.village_id);
        const name        = req.body.name;
        const explanation = req.body.explanation;
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

        const beach: Partial<Beach> = {
            village_id,
            name,
            extra: {
                explanation
            },
            logo_url,
            gallery,
            address,
            latitude,
            longitude
        };
        await service.create(beach);

        res.status(201).send(`Plaj '${name}' başarıyla eklendi`);
    } catch (err) {
        console.error(err);
        res.status(500).send("Plaj eklenirken hata oluştu");
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
