import { Router } from "express";
import { show, list, create, del, map } from "../Controller/Village";

const router = Router();

router.get("", show)
router.get("/map", map)
router.get("/list", list);
router.post("/create", create);
router.delete("/:id", del);

export default router;
