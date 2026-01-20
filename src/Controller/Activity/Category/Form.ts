import { Request, Response } from "express";

export const createForm = async (req: Request, res: Response) => {
    res.render("activity/category/form/create", {
        layout: false
    });
};
