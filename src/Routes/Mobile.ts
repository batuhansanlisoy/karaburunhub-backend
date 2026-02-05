import { Router } from "express";
import { show } from "../Controller/Mobile";


const router = Router();

router.get("", show);

export default router;
