import { Request, Response } from "express";
import { Item } from "../../../Entity/Organization/Category/Item";
import { CategoryService } from "../../../Service/Organization/Category";
import { ItemService } from "../../../Service/Organization/Category/Item";

const service = new ItemService();
const category_service = new CategoryService();

export const show = async (req: Request, res: Response) => {
    
    const categories = await category_service.list();

    res.render("organization/category/item/index", {
    title: "İşletme Kategori Çeşitleri",
    activePage: "organization/category/item",
    page: "organization/category/item",
    categories
    });
};

export const list = async (req: Request, res: Response) => {
    try {
        const items: Item[] = await service.list();
        res.json(items);
    } catch (err) {
        console.error(err);
        res.status(500).send("Organizasyon Kategori Çeşit listesi alınamadı");
    }
};

export const getByOrganizationCategoryId = async(req: Request, res: Response) => {
    const id = Number(req.query.id);
    try {
        const items: Item[] = await service.getByOrganizationCategoryId(id);
        res.json(items);
    } catch (err) {
        console.error(err);
        res.status(500).send("Veri alınırken bi hata meydana geldi");
    }
}

export const create = async (req: Request, res: Response) => {
    try {

        const name = req.body.name;
        const organization_category_id = req.body.organization_category_id;

        const item: Partial<Item> = { name, organization_category_id };

        await service.create(item);

        res.status(201).send("Kayıt başarıyla eklendi");
    } catch (err) {
        console.error(err);
        res.status(500).json({ "message": "Kayıt Eklenirken Bir Hata Meydana Geldi", err})
    }
};

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
