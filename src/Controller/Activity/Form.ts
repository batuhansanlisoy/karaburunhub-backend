import { Request, Response } from "express";
import { CategoryService } from "../../Service/Activity/Category";
import { VillageService } from "../../Service/Village";
import { ActivityService } from "../../Service/Activity";

const category_service = new CategoryService();
const village_service = new VillageService();
const activity_service = new ActivityService();

export const createForm = async (req: Request, res: Response) => {
    const categories = await category_service.list();
    const villages = await village_service.list();

    res.render("activity/form/create", {
        categories,
        villages,
        layout: false
    });
};

export const editForm = async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    const activity = await activity_service.single(id);

    res.render("activity/form/edit", {
        activityId: id,
        layout: false,
        name: activity.name
    });
};

export const uploadForm = async (req: Request, res: Response) => {
    const id = req.params.id;
    res.render("activity/form/upload", {
        activityId: id,
        layout: false
    });
};
