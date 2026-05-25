import { Router } from "express";
import * as ExploreFeedController from "~/Controller/ExploreFeed";

const router = Router();

router.get("/list", ExploreFeedController.list);

export default router;
