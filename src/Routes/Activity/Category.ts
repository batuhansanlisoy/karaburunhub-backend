import { Router } from "express";
import * as ActivityCategoryController from "~/Controller/Activity/Category";
import { createForm } from "~/Controller/Activity/Category/Form";

const router = Router();

router.get("/", ActivityCategoryController.show);
router.get("/form/create", createForm);
router.get("/list", ActivityCategoryController.list);
router.post("/create", ActivityCategoryController.create);
router.delete("/:id", ActivityCategoryController.del);

export default router;
