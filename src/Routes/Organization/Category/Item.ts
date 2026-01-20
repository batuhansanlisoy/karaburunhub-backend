import { Router } from "express";
import { show, list, create, del, getByOrganizationCategoryId } from "../../../Controller/Organization/Category/Item";
import { createForm } from "~/Controller/Organization/Category/Item/Form";

const router = Router();

router.get("/", show);
router.get("/form/create", createForm)
router.get("/list", list);
router.post("/create", create);
router.delete("/:id", del);
router.get("/orgCategory", getByOrganizationCategoryId);

export default router;
