// src/controllers/UserController.ts
import { Request, Response } from "express";
import { Organization } from "../Entity/Organization";
import { OrganizationService } from "../Service/Organization";

const service = new OrganizationService();

export const show = async (req: Request, res: Response) => {
    res.render("organization/index", {
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
    const category_id = req.body.category_id;
    const name        = req.body.name;
    const email       = req.body.email;
    const phone       = req.body.phone;
    const address     = req.body.address;
    const website     = req.body.website;
    const latitude    = req.body.latitude ? parseFloat(req.body.latitude) : null;
    const longitude   = req.body.longitude ? parseFloat(req.body.longitude) : null;
    const items       = req.body.item_ids;

    if (!name || !address) {
        return res.status(400).send("Boş Alanlar var");
    }

    const organization: Partial<Organization> = {
        category_id, name, email, phone, address,
        website, latitude, longitude
    };

    try {
        const result = await service.create(organization, items);
        res.status(201).json({ success: true, message: "Organization Created", result });
    } catch (err: any) {
        console.error(err);
        res.status(500).json({ success: false, message: err.message || "Organization could not be created" });
    }
};

export const update = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const name = req.body.name;

    const organization: Partial<Organization> = { name };

    try {
        const result = await service.update(id, organization);
        return res.json({ result });
    } catch(err: any) {
        console.error(err);
        res.status(500).json({ message: "Kayıt Güncellenemedi", error: err.message || err});
    }
}

export const uploadPhoto = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    
    const files: any = req.files;
    let cover: {url: string, filename: string, path: string} | undefined;

    if (files && files.cover && files.cover[0]) {
        const file = files.cover[0];

        cover = {
            url: `/upload/organization/${id}/${file.filename}`,
            filename: file.filename,
            path: `/upload/organization/${id}`
        };
    }

    const gallery: string[] | undefined = files?.['gallery[]']
        ? files['gallery[]'].map((f: any) => `/upload/organization/${id}/${f.filename}`)
        : undefined;
    
    const organization: Partial<Organization> = { cover, gallery };

    try {
        const result = await service.update(id, organization);
        return res.json({ result });
    } catch(err: any) {
        console.error(err);
        res.status(500).json({ message: "Kayıt Güncellenemedi", error: err.message || err});
    }
}

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
