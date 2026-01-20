import { Router } from "express";
import { show, list, create, del } from "../../Controller/Activity/Category";
import { createForm } from "../../Controller/Activity/Category/Form";
const router = Router();

router.get("/", show);
router.get("/form/create", createForm);
router.get("/list", list);
router.post("/create", create);
router.delete("/:id", del);

export default router;
