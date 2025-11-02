// src/controllers/UserController.ts
import { Request, Response } from "express";
import { CategoryService } from "../../Service/Organization/Category";
import { OrganizationService } from "../../Service/Organization/Organization";
import { Category } from "../../Entity/Organization/Category";

const service = new CategoryService();
const organization_service = new OrganizationService();

export const show = async (req: Request, res: Response) => {

    const categories: Category[] = await service.list();

    res.render("organization/category", {
    categories,
    title: "İşletmeler",
    activePage: "category",
    page: "category"
    });
};

export const list = async (req: Request, res: Response) => {
    try {
        const categories: Category[] = await service.list();
        res.json(categories);
    } catch (err) {
        res.status(500).json({ error: err });
    }
    };

    export const create = async (req: Request, res: Response) => {
    try {
        const category: Category = req.body;
        await service.create(category);
        res.status(201).json({ message: "Kategori Oluşturuldu" });
    } catch (err) {
        res.status(500).json({ error: err });
    }
};
