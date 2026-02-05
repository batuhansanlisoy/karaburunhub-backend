import { Request, Response } from "express";
import { CategoryService } from "../../Service/Organization/Category";
import { Category } from "../../Entity/Organization/Category";
import { OrganizationCategoryConverter } from "../../Converter/Organization/Category";

const service = new CategoryService();

export const show = async (req: Request, res: Response) => {
    res.render("organization/category/index", {
    title: "İşletme Türleri",
    activePage: "organization/category",
    page: "organization/category"
    });
};

export const list = async (req: Request, res: Response) => {
    try {
        const categories: Category[] = await service.list();
        const response = OrganizationCategoryConverter.toListResponse(categories);
        
        res.json(response);
    } catch (err) {
        console.error(err);
        res.status(500).send("Organizasyon listesi alınamadı");
    }
};

export const create = async (req: Request, res: Response) => {
    try {

        const name = req.body.name;
        const icon = req.body.icon;
        const icon_color = req.body.icon_color;

        if (!name) {
            return res.status(400).send("Village, Title ve Adress Alanları zorunludur");
        }

        const category: Partial<Category> = { name, extra: { icon, icon_color} };

        await service.create(category);

        res.status(201).send("Kategori Ekleme İşlemi Başarılı");
    } catch (err) {
        console.error(err);
        res.status(500).json({ "message": "Kayıt Eklenirken Bir Hata Meydana Geldi", err})
    }
};

export const del = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const status = await service.del(id);
        return res.json({ deletedRows: status });
    } catch (err: any) {
        console.error(err);
        res.status(500).json({ message: "Kayıt Silinemedi", error: err.message || err });
    }
};
