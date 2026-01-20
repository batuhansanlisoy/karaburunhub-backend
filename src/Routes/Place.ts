import { Router } from "express";
import { createForm, editForm, uploadForm } from "../Controller/Place/Form";
import { show, list, create, del, update, uploadPhoto } from "../Controller/Place";
import { FileService } from "../Service/File";

const router = Router();
const upload = FileService.uploader("place", (req) => req.params.id);

router.get("", show);
router.get("/form/create", createForm);
router.get("/form/edit/:id", editForm);
router.get("/form/upload/:id", uploadForm);
router.get("/list", list);

router.post("/create",create);
router.put("/:id", update);

router.put("/upload/:id", upload.fields([
    { name: "cover", maxCount: 1 },
    { name: "gallery[]", maxCount: 10 }
]), uploadPhoto);

router.delete("/:id", del);

export default router;
