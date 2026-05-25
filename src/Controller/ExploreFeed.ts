import { Request, Response } from "express";
import { ExploreFeedService } from "../Service/ExploreFeed";
import { ExploreFeed } from "../Entity/ExploreFeed";
import { ExploreFeedConverter } from "~/Converter/ExploreFeed";

const service = new ExploreFeedService();

export const list = async (req: Request, res: Response) => {

    const shuffle  = req.query.shuffle !== undefined ? req.query.shuffle === 'true' : undefined;
    const active   = req.query.active  !== undefined ? req.query.active  === 'true' : undefined;
    const itemType = req.query.itemType ? String(req.query.itemType) : undefined;
    const itemId   = req.query.itemId && !isNaN(Number(req.query.itemId)) ? Number(req.query.itemId) : undefined;

    try {
        const data: ExploreFeed[] = await service.list(
            shuffle, active, itemType, itemId
        );
        const resp = ExploreFeedConverter.toListResponse(data);
        res.json(resp);
    } catch (err: any) {
        console.error("Explore feed list error", err);
        res.status(500).json({
            message: "An error occurred while fetching the explore feed list",
            error: err?.message || ""
        });
    }
};

