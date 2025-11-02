// src/routes/User.ts
import { Router } from "express";
import { show, list, create} from "../Controller/Beach";

const router = Router();

router.get("/", show);
router.get("/data", list);
router.post("/", create);

export default router;
