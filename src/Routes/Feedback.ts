import { Router } from "express";
import { requireAuth } from "~/Middleware/Auth";
import * as FeedbackController from "~/Controller/Feedback";

const router = Router();

router.get("/", requireAuth, FeedbackController.show);
router.get("/form", FeedbackController.showForm);
router.get("/list", requireAuth, FeedbackController.list);
router.post("/create", FeedbackController.create);

export default router;
