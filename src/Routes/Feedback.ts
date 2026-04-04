import { Router } from "express";
import { show, list, create } from "../Controller/Feedback";
import { requireAuth } from "../Middleware/Auth";

const router = Router();

router.get("/", requireAuth, show);
router.get("/list", requireAuth, list);
router.post("/create", create);

export default router;
