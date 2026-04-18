import { Router } from "express";
import { show, list, showForm, create } from "../Controller/Feedback";
import { requireAuth } from "../Middleware/Auth";

const router = Router();

router.get("/", requireAuth, show);
router.get("/form", showForm);
router.get("/list", requireAuth, list);
router.post("/create", create);

export default router;
