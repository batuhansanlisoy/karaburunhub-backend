import { Router } from "express";
import { R2Service } from "~/Service/R2";
import { FileService } from "~/Service/File";
import * as BeachController from "~/Controller/Beach";
import * as BeachFormController from "~/Controller/Beach/Form";

const router = Router();
const upload = FileService.uploader();
const videoUpload = R2Service.videoStreamUploader("beach");

router.get("/", BeachController.show);
router.get("/detail/:id", BeachController.detail);
router.get("/form/create", BeachFormController.createForm);
router.get("/form/edit/:id", BeachFormController.editForm);
router.get("/form/upload/:id", BeachFormController.uploadForm);
router.get("/list", BeachController.list);
router.get("/:id/nearest-activity", BeachController.nearestActivity);
router.get("/:id/nearest-places", BeachController.nearestPlaces);
router.get("/:id/nearest-organizations", BeachController.nearestOrganizations);

router.patch("/:id/highlight", BeachController.highligt);

router.post("/create",BeachController.create);
router.put("/:id", BeachController.update);

router.put("/upload/:id", upload.fields([
    { name: "cover", maxCount: 1 },
    { name: "gallery[]", maxCount: 10 }
]), BeachController.uploadPhoto);

router.put("/upload-video/:id", videoUpload.single("video"), BeachController.uploadVideo);

router.delete("/:id/delete-video", BeachController.deleteVideo);
router.delete("/:id/photo", BeachController.deletePhoto);
router.delete("/:id", BeachController.del);

export default router;
