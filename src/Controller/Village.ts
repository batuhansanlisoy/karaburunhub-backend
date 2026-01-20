import { Request, Response } from "express";
import { VillageService } from "../Service/Village";
import { Village } from "../Entity/Village";

const service = new VillageService();

export const show = async (req: Request, res: Response) => {
    res.render("village/index", {
    title: "Köyler",
    activePage: "village",
    page: "village"
    });
};

export const map = async (req: Request, res: Response) => {

    res.render("village/map", {
    title: "Köyler",
    activePage: "village",
    page: "village"
    });
};

export const list = async (req: Request, res: Response) => {
    try {
        const villages: Village[] = await service.list();
        res.json(villages);
    } catch (err: any) {
        console.error(err);
        res.status(500).json({ message: "Veri getirilemedi", error: err.message || err });
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

        res.json({ success: true, message: "Kayıt Başarıyla Eklendi" });
    } catch (err: any) {
        console.error(err);
        res.status(500).json({ message: "Kayıt Oluşturulamadı", error: err.message || err });
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
