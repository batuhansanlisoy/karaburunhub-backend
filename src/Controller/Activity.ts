import { Request, Response } from "express";
import { ActivityService } from "../Service/Activity";
import { Activity } from "../Entity/Activity";
import { VillageService } from "../Service/Village";
import { CategoryService } from "../Service/Activity/Category";
import { ActivityConverter } from "../Converter/Activity";

const service = new ActivityService();
const village_service = new VillageService();
const category_service = new CategoryService();
const activity_converter = new ActivityConverter();

export const show = async (req: Request, res: Response) => {

    const categories = await category_service.list();
    const villages = await village_service.list();

    res.render("activity/index", {
    categories,
    villages,
    title: "Etkinlikler",
    activePage: "activity",
    page: "activity"
    });
};

export const list = async (req: Request, res: Response) => {
    try {
        const village_id  = req.query.village_id ? Number(req.query.village_id) : undefined;
        const category_id = req.query.category_id ? Number(req.query.category_id) : undefined;

        const activities: Activity[] = await service.list(village_id, category_id);
        const response = ActivityConverter.toListResponse(activities);

        res.json(response);
    } catch (err) {
        res.status(500).json({ error: err });
    }
};

export const create = async (req: Request, res: Response) => {
    try {

        const files: any = req.files;

        const category_id = Number(req.body.category_id);
        const village_id  = Number(req.body.village_id);
        const name        = req.body.name;
        const begin       = req.body.begin;
        const end         = req.body.end;
        const explanation = req.body.explanation;
        const address     = req.body.address;
        const latitude    = req.body.latitude ? parseFloat(req.body.latitude) : null;
        const longitude   = req.body.longitude ? parseFloat(req.body.longitude) : null;
        

        const logo_url = files?.logo_url?.[0]
            ? `/upload/activity/${files.logo_url[0].filename}`
            : undefined;

        const gallery: string[] | undefined = files?.['gallery[]']
            ? files['gallery[]'].map((f: any) => `/upload/activity/${f.filename}`)
            : undefined;

            
        if (!village_id || !name || !address) {
            return res.status(400).send("Zorunlu alanları doldurunuz");
        }

        const activity: Partial<Activity> = {
            category_id,
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
        await service.create(activity);

        res.status(201).send("Activity Oluşturuldu");
    } catch (err) {
        console.error(err);
        res.status(500).send("Hata!. Activity Oluşturulamadı");
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
