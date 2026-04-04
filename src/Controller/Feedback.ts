import { Request, Response } from "express";
import { FeedbackConverter } from "~/Converter/Feedback";
import { Feedback } from "~/Entity/Feedback";
import { FeedbackService } from "~/Service/Feedback";

const service = new FeedbackService();

export const show = async (req: Request, res: Response) => {
    res.render("feedback/index", {
    title: "Geri Bildirim",
    activePage: "feedback",
    page: "feedback"
    });
};

export const list = async (req: Request, res: Response) => {
    try {
        const feedbacks: Feedback[] = await service.list();
        const response = FeedbackConverter.toListResponse(feedbacks);

        res.json(response);
    } catch (err) {
        console.error(err);
        res.status(500).send("Geri Bildirim listesi alınırken hata meydana geldi.");
    }
};

export const create = async (req: Request, res: Response) => {
    const name      = req.body.name ?? null;
    const last_name = req.body.last_name ?? null;
    const email     = req.body.email ?? null;
    const phone     = req.body.phone ?? null;
    const message   = req.body.message;

    const payload: Partial<Feedback> = {
        name, last_name, email, phone, content: { message }
    };

    try {
        const result = await service.create(payload);
        res.status(201).json({ success: true, message: "Geri Bildirim Kaydı Başarılı", result });
    } catch (err: any) {
        console.error(err);
        res.status(500).json({ success: false, message: err.message || "Geri Bildirim Kaydı Oluşturulamadı" });
    }
};