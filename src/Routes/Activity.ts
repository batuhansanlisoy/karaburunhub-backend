import { Router } from "express";
import { FileService } from "~/Service/File";
import { R2Service } from "~/Service/R2";
import * as ActivityController from "~/Controller/Activity";
import * as ActivityFormController from "~/Controller/Activity/Form";

const router = Router();

const upload = FileService.uploader();
const videoUpload = R2Service.videoStreamUploader("activity");

router.get("", ActivityController.show);
router.get("/detail/:id", ActivityController.detail);
router.get("/form/create", ActivityFormController.createForm);
router.get("/form/edit/:id", ActivityFormController.editForm);
router.get("/form/upload/:id", ActivityFormController.uploadForm);
router.get("/list", ActivityController.list);
router.get("/:id/nearest-beaches", ActivityController.nearestBeaches);
router.get("/:id/nearest-places", ActivityController.nearestPlaces);
router.get("/:id/nearest-organizations", ActivityController.nearestOrganizations);

router.post("/create", ActivityController.create);
router.put("/:id", ActivityController.update);
router.put("/timeline/:id", ActivityController.timeline);

router.put("/upload/:id", upload.fields([
    { name: "cover", maxCount: 1 },
    { name: "gallery[]", maxCount: 10 }
]), ActivityController.uploadPhoto);

router.put("/upload-video/:id", videoUpload.single("video"), ActivityController.uploadVideo);

router.delete("/:id/delete-video", ActivityController.deleteVideo);
router.delete("/:id/photo", ActivityController.deletePhoto);
router.delete("/:id", ActivityController.del);

export default router;
