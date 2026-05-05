import { Request, Response } from "express";
import { NotificationService } from "../Service/Notification";
import { Notification } from "../Entity/Notification";
import { NotificationConverter } from "../Converter/Notification";

const service = new NotificationService();

export const show = async (req: Request, res: Response) => {
    res.render("notification/index", {
        title: "Bildirimler",
        activePage: "notification",
        page: "notification"
    });
};

export const list = async (req: Request, res: Response) => {
    const ids = req.query.ids ? String(req.query.ids).split(',').map(Number) : undefined;

    try {
        const notifications: Notification[] = await service.list(ids);
        const response = NotificationConverter.toListResponse(notifications);

        res.json(response);
    } catch (err) {
        res.status(500).json({ error: err });
    }
};

export const create = async (req: Request, res: Response) => {
    const title   = req.body.title;
    const message = req.body.message;

    const notification: Partial<Notification> = { title, message };

    try {
        const result = await service.create(notification);
        res.status(201).json({ success: true, message: "Notification Created", result });
    } catch (err: any) {
        console.error(err);
        res.status(500).json({ success: false, message: err.message || "Notification could not be created" });
    }
};

export const update = async (req: Request, res: Response) => {
    const id        = Number(req.params.id);
    const title     = req.body.title;
    const message   = req.body.message;
    const is_active = req.body.is_active ? true : false;

    const notification: Partial<Notification> = { title, message, is_active };

    try {
        const result = await service.update(id, notification);
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