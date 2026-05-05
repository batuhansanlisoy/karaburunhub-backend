import { Router } from "express";
import { createForm, editForm } from "~/Controller/Notification/Form";
import { show, create, list, update, del } from "~/Controller/Notification";

const router = Router();

router.get("/", show);
router.get("/form/create", createForm);
router.get("/form/edit/:id", editForm);
router.get("/list", list);
router.post("/create",create);
router.put("/:id", update);
router.delete("/:id", del);

export default router;
