import { Router } from "express";
import { show, list, create, del } from "../Controller/Event";
import { FileService } from "../Service/File";

const router = Router();
const upload = FileService.uploader("beach");

router.get("", show)
router.get("/list", list);
router.post("/create", upload.single("logo_url"), create);
router.delete("/:id", del);

export default router;
