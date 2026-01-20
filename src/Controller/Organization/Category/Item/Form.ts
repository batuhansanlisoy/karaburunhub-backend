import { Request, Response } from "express";
import { CategoryService } from "../../../../Service/Organization/Category";

const category_service = new CategoryService();

export const createForm = async (req: Request, res: Response) => {
    const categories = await category_service.list();

    res.render("organization/category/item/form/create", {
        categories,
        layout: false
    });
};
