import { Request, Response } from "express";

export const createForm = async (req: Request, res: Response) => {
    res.render("village/form/create", {
        layout: false
    });
};
