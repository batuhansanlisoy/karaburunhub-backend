// src/routes/User.ts
import { Router } from "express";
import { show, list, create} from "../Controller/Place";

const router = Router();

router.get("", show)
router.get("/list", list);
router.post("/create", create);

export default router;
