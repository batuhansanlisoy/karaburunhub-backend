import { Request, Response } from "express";

export const createForm = async (req: Request, res: Response) => {
    res.render("organization/category/form/create", {
        layout: false
    });
};
