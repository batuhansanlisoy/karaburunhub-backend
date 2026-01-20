import { Router } from "express";
import { show, list, create, del } from "~/Controller/Organization/Category";
import { createForm } from "~/Controller/Organization/Category/Form"

const router = Router();

router.get("/", show);
router.get("/form/create", createForm);
router.get("/list", list);
router.post("/create", create);
router.delete("/:id", del);

export default router;
