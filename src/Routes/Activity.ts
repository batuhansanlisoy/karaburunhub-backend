import { Router } from "express";
import { show, list, create, del } from "../Controller/Activity";
import { FileService } from "../Service/File";

const router = Router();
const upload = FileService.uploader("activity");

router.get("", show)
router.get("/list", list);
router.post("/create", upload.fields([
    { name: "logo_url", maxCount: 1 },
    { name: "gallery[]", maxCount: 10 }
    ]),
    create
);
router.delete("/:id", del);

export default router;
