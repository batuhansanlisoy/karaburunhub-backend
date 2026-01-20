import { Request, Response } from "express";
import { CategoryService } from "~/Service/Organization/Category";
import { OrganizationService } from "~/Service/Organization";

const org_category_service = new CategoryService();
const org_service = new OrganizationService();

export const createForm = async (req: Request, res: Response) => {
    const categories = await org_category_service.list();

    res.render("organization/form/create", {
        categories,
        layout: false
    });
};

export const editForm = async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    const organization = await org_service.single(id);

    res.render("organization/form/edit", {
        organizationId: id,
        layout: false,
        name: organization.name
    });
};

export const uploadForm = async (req: Request, res: Response) => {
    const id = req.params.id;
    res.render("organization/form/upload", {
        organizationId: id,
        layout: false
    });
};
