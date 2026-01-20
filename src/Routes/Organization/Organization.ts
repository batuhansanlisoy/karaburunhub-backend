// src/routes/User.ts
import { Router } from "express";
import { show, list, create, del } from "../../Controller/Organization";
import { FileService } from "../../Service/File";

const router = Router();

const upload = FileService.uploader("organization");

router.get("", show);
router.get("/list", list);
router.post("/create", upload.fields([
    { name: "cover", maxCount: 1 },
    { name: "gallery[]", maxCount: 10 }
    ]), create);
router.delete("/:id", del);
export default router;
