import { Request, Response } from "express";
import { CategoryService } from "~/Service/Organization/Category";
import { OrganizationService } from "~/Service/Organization";
import { VillageService } from "~/Service/Village";

const org_category_service = new CategoryService();
const org_service = new OrganizationService();
const village_service = new VillageService();

export const createForm = async (req: Request, res: Response) => {
    const [categories, villages] = await Promise.all([
        org_category_service.list(),
        village_service.list()
    ]);

    res.render("organization/form/create", {
        categories,
        villages,
        layout: false
    });
};

export const editForm = async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    const organization = await org_service.single(id);

    const [categories, villages] = await Promise.all([
        org_category_service.list(),
        village_service.list()
    ]);

    res.render("organization/form/edit", {
        organizationId: id,
        layout: false,
        name: organization.name,
        email: organization.email,
        phone: organization.phone,
        address: organization.address,
        website: organization.website,
        latitude: organization.latitude,
        longitude: organization.longitude,
        category_id: organization.category_id,
        village_id: organization.village_id,
        categories: categories,
        villages: villages
    });
};

export const uploadForm = async (req: Request, res: Response) => {
    const id = req.params.id;
    res.render("organization/form/upload", {
        organizationId: id,
        layout: false
    });
};
