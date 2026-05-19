import { Router } from "express";
import { requireAuth } from "~/Middleware/Auth";
import * as RBController from "~/Controller/RequestBusiness";

const router = Router();

router.get("/", requireAuth, RBController.show)
router.get("/form", RBController.showForm);
router.get("/list", requireAuth, RBController.list);
router.post("/create", RBController.create);
router.patch("/:id/mark_as_read", requireAuth, RBController.markAsRead);
router.patch("/:id/change_status", requireAuth, RBController.changeStatus);

export default router;