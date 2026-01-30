import { Router } from "express";
import { createForm, editForm, uploadForm } from "~/Controller/Beach/Form";
import { FileService } from "../Service/File";
import {
    show, list, create, update, uploadPhoto, del,
    nearestActivity, nearestOrganizations, nearestPlaces
} from "../Controller/Beach";

const router = Router();
const upload = FileService.uploader("beach", (req) => req.params.id);

router.get("/", show);
router.get("/form/create", createForm);
router.get("/form/edit/:id", editForm);
router.get("/form/upload/:id", uploadForm);
router.get("/list", list);
router.get("/:id/nearest-activity", nearestActivity);
router.get("/:id/nearest-places", nearestPlaces);
router.get("/:id/nearest-organizations", nearestOrganizations);

router.post("/create",create);
router.put("/:id", update);

router.put("/upload/:id", upload.fields([
    { name: "cover", maxCount: 1 },
    { name: "gallery[]", maxCount: 10 }
]), uploadPhoto);

router.delete("/:id", del);

export default router;
