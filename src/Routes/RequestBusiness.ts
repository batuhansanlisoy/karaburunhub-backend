import { Router } from "express";
import { show, list, showForm, create, markAsRead, changeStatus } from "../Controller/RequestBusiness";
import { requireAuth } from "../Middleware/Auth";

const router = Router();

router.get("/", requireAuth, show)
router.get("/form", showForm);
router.get("/list", requireAuth, list);
router.post("/create", create);
router.patch("/:id/mark_as_read", markAsRead);
router.patch("/:id/change_status", changeStatus);

export default router;