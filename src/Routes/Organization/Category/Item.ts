import { Router } from "express";
import { show, list, create, del, getByOrganizationCategoryId } from "../../../Controller/Organization/Category/Item";

const router = Router();

router.get("/", show);
router.get("/list", list);
router.post("/create", create);
router.delete("/:id", del);
router.get("/orgCategory", getByOrganizationCategoryId);

export default router;
