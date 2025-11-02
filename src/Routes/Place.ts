// src/routes/User.ts
import { Router } from "express";
import { list, create} from "../Controller/Place";

const router = Router();

router.get("", list);
router.post("", create);

export default router;
