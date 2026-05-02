import { Request, Response } from "express";

export const showPrivacy = async (req: Request, res: Response) => {
    res.render("info/privacy", {
    title: "Gizlilik Politikası",
    layout: false
    });
};

export const showForm = async (req: Request, res: Response) => {
    res.render("request/business/form/create", {
    title: "Partnerlik Başvurusu",
    layout: false,
    });
};