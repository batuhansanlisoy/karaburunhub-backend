import { Router } from "express";
import * as NotificationController from "~/Controller/Notification";
import * as NotificationFormController from "~/Controller/Notification/Form";

const router = Router();

router.get("/", NotificationController.show);
router.get("/form/create", NotificationFormController.createForm);
router.get("/form/edit/:id", NotificationFormController.editForm);
router.get("/list", NotificationController.list);
router.post("/create", NotificationController.create);
router.put("/:id", NotificationController.update);
router.delete("/:id", NotificationController.del);

export default router;
