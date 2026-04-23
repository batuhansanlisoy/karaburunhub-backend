import { Router } from "express";
import { createForm, uploadForm, editForm } from "../Controller/LocalProducer/Form";
import { FileService } from "../Service/File";
import { show, list, create, highlight, activation, del, uploadPhoto, update } from "../Controller/LocalProducer";

const router = Router();
const upload = FileService.uploader();

router.get("", show);
router.get("/form/create", createForm);
router.get("/form/edit/:id", editForm);
router.get("/form/upload/:id", uploadForm);
router.get("/list", list);

router.post("/create",create);

router.patch("/:id/highlight", highlight);
router.patch("/:id/activation", activation);

router.put("/:id", update);

router.put("/upload/:id", upload.fields([
    { name: "cover", maxCount: 1 },
    { name: "gallery[]", maxCount: 10 }
]), uploadPhoto);

router.delete("/:id", del);

export default router;
