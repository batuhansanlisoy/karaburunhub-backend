// src/routes/User.ts
import { Router } from "express";
import { createForm, editForm, uploadForm } from "~/Controller/Organization/Form";
import { FileService } from "~/Service/File";
import {
    show, list, create, del, update, uploadPhoto,
    nearestActivity, nearestBeaches, nearestPlaces
} from "~/Controller/Organization";

const router = Router();
const upload = FileService.uploader("organization", (req) => req.params.id);

router.get("", show);
router.get("/form/create", createForm);
router.get("/form/edit/:id", editForm);
router.get("/form/upload/:id", uploadForm);
router.get("/list", list);
router.get("/:id/nearest-activity", nearestActivity);
router.get("/:id/nearest-places", nearestPlaces);
router.get("/:id/nearest-beaches", nearestBeaches);

router.post("/create",create);
router.put("/:id", update);

router.put("/upload/:id", upload.fields([
    { name: "cover", maxCount: 1 },
    { name: "gallery[]", maxCount: 10 }
]), uploadPhoto);

router.delete("/:id", del);
export default router;
