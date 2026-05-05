import { Request, Response } from "express";
import { NotificationService } from "~/Service/Notification";

const notif_service = new NotificationService();

export const createForm = async (req: Request, res: Response) => {
    res.render("notification/form/create", {
        layout: false
    });
};

export const editForm = async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    const notification = await notif_service.single(id);

    res.render("notification/form/edit", {
        notificationId: id,
        title: notification.title,
        message: notification.message,
        is_active: notification.is_active,
        layout: false,
    });
};