// src/controllers/UserController.ts
import { Request, Response } from "express";
import { OrganizationService } from "../../Service/Organization/Organization";
import { CategoryService } from "../../Service/Organization/Category";
import { Organization } from "../../Entity/Organization/Organization";
import { Category } from "../../Entity/Organization/Category";

const service = new OrganizationService();
const category_service = new CategoryService();

export const show = async (req: Request, res: Response) => {

    const categories: Category[] = await category_service.list();

    res.render("organization/index", {
        categories,
        title: "İşletmeler",
        activePage: "organization",
        page: "organization"
    });
};

export const list = async (req: Request, res: Response) => {
    try {
        const category_id = req.query.category_id ? Number(req.query.category_id) : undefined;

        const organizations: Organization[] = await service.list(category_id);
        res.json(organizations);
    } catch (err) {
        console.error(err);
        res.status(500).send("Organizasyon listesi alınamadı");
    }
};

export const create = async (req: Request, res: Response) => {
    try {

        const files: any = req.files;
        const category_id = req.body.category_id;
        const name = req.body.name;
        const email = req.body.email;
        const phone = req.body.phone;
        const address = req.body.address;
        const website = req.body.website;
        const latitude = req.body.latitude ? parseFloat(req.body.latitude) : null;
        const longitude = req.body.longitude ? parseFloat(req.body.longitude) : null;
        
        let logo: { url: string, filename: string, path: string} | undefined = undefined;

        if (files && files.logo && files.logo[0]) {
            const file = files.logo[0];

            logo = {
                url: `/upload/organization/${file.filename}`,
                filename: file.filename,
                path: "/upload/organization"
            };
        }
        
        const gallery: string[] | undefined = files?.['gallery[]']
            ? files['gallery[]'].map((f: any) => `/upload/organization/${f.filename}`)
            : undefined;

        if (!name || !address) {
            return res.status(400).send("Boş Alanlar var");
        }

        const organization: Partial<Organization> = {
            category_id, name, email, phone, address,
            website, latitude, longitude, logo, gallery
        };

        await service.create(organization);

        res.status(201).send("Kayıt Başarıyla Eklendi");
    } catch (err) {
        console.error(err);
        res.status(500).send("Plaj eklenirken hata oluştu");
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
