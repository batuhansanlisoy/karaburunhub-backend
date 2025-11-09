import { Router } from "express";
import { show, list, create, del } from "../../Controller/Organization/Category";
const router = Router();

router.get("/", show);
router.get("/list", list);
router.post("/create", create);
router.delete("/:id", del);

export default router;
