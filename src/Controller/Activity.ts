import { Request, Response } from "express";
import { ActivityService } from "../Service/Activity";
import { Activity } from "../Entity/Activity";
import { ActivityConverter } from "../Converter/Activity";

const service = new ActivityService();

export const show = async (req: Request, res: Response) => {
    res.render("activity/index", {
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
    const category_id = Number(req.body.category_id);
    const village_id  = Number(req.body.village_id);
    const name        = req.body.name;
    const begin       = req.body.begin;
    const end         = req.body.end;
    const explanation = req.body.explanation;
    const address     = req.body.address;
    const latitude    = req.body.latitude ? parseFloat(req.body.latitude) : null;
    const longitude   = req.body.longitude ? parseFloat(req.body.longitude) : null;
        
    if (!village_id || !name || !address) {
        return res.status(400).json({ success: false, message: "Zorunlu alanları doldurunuz" });
    }

    const activity: Partial<Activity> = {
        category_id, village_id, name, begin, end, content: { explanation },
        address, latitude, longitude
    };

    try {
        const result = await service.create(activity);
        res.status(201).json({ success: true, message: "Activity Oluşturuldu", result });
    } catch (err: any) {
        console.error(err);
        res.status(500).json({ success: false, message: err.message || "Activity Oluşturulamadı" });
    }
};

export const update = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const name = req.body.name;

    const activity: Partial<Activity> = { name };

    try {
        const result = await service.update(id, activity);
        return res.json({ result });
    } catch(err: any) {
        console.error(err);
        res.status(500).json({ message: "Kayıt Güncellenemedi", error: err.message || err});
    }
}

export const timeline = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const timeline = Array.isArray(req.body.timeline) ? req.body.timeline : [];

    try {
        const result = await service.update(id, { content: { timeline } });
        return res.json({ result });
    } catch (err: any) {
        console.error(err);
        res.status(500).json({ message: "Kayıt Güncellenemedi", error: err.message || err });
    }
};

export const uploadPhoto = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    
    const files: any = req.files;
    let cover: {url: string, filename: string, path: string} | undefined;

    if (files && files.cover && files.cover[0]) {
        const file = files.cover[0];

        cover = {
            url: `/upload/activity/${id}/${file.filename}`,
            filename: file.filename,
            path: `/upload/activity/${id}`
        };
    }

    const gallery: string[] | undefined = files?.['gallery[]']
        ? files['gallery[]'].map((f: any) => `/upload/activity/${id}/${f.filename}`)
        : undefined;
    
    const activity: Partial<Activity> = { cover, gallery };

    try {
        const result = await service.update(id, activity);
        return res.json({ result });
    } catch(err: any) {
        console.error(err);
        res.status(500).json({ message: "Kayıt Güncellenemedi", error: err.message || err});
    }
}

export const del = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    
    try {
        const status = await service.del(id);
        return res.json({ deletedRows: status });
    } catch (err: any) {
        console.error(err);
        res.status(500).json({ message: "Kayıt Silinemedi", error: err.message || err });
    }
};