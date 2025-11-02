import { Router } from "express";
import { list, create } from "../Controller/Village";

const router = Router();

router.get("/", list);
router.post("/", create);

export default router;
