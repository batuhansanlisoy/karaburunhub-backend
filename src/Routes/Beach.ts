import { Router } from "express";
import { show, single, list, create, del } from "../Controller/Beach";
import { FileService } from "../Service/File";

const router = Router();

const upload = FileService.uploader("beach");

router.get("/", show);
// router.get("/:id", single);
router.get("/list", list);
router.post("/create", upload.fields([
    { name: "cover", maxCount: 1 },
    { name: "gallery[]", maxCount: 10 }
    ]),
    create
);
router.delete("/:id", del);

export default router;
