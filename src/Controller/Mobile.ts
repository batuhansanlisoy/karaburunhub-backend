import { Request, Response } from "express";

export const show = async (req: Request, res: Response) => {
    res.render("mobile/index", {
    title: "Mobil Yöntetim",
    activePage: "mobile",
    page: "mobile"
    });
};

