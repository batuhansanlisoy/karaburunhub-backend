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
    const villages = await village_service.list();

    res.render("activity/form/edit", {
        activityId: id,
        layout: false,
        name: activity.name,
        explanation: (activity.content as any)?.explanation,
        latitude: activity.latitude,
        longitude: activity.longitude,
        begin: activity.begin
            ? new Date(activity.begin).toISOString().split('T')[0]
            : "",
        end: activity.end
            ? new Date(activity.end).toISOString().split('T')[0]
            : "",
        address: activity.address,
        village_id: activity.village_id,
        villages: villages
    });
};

export const uploadForm = async (req: Request, res: Response) => {
    const id = req.params.id;
    res.render("activity/form/upload", {
        activityId: id,
        layout: false
    });
};
