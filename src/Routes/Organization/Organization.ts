import { Router } from "express";
import { show, list } from "../../Controller/Organization/Organization";
const router = Router();

router.get("/", show);
router.get("/data", list);
// router.post("/", create);

export default router;
