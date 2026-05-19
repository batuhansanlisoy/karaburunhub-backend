import { Router } from "express";
import { R2Service } from "~/Service/R2";
import { FileService } from "../Service/File";
import * as PlaceController from "~/Controller/Place";
import * as PlaceFormController from "~/Controller/Place/Form";

const router = Router();

const upload = FileService.uploader();
const videoUpload = R2Service.videoStreamUploader("place");

router.get("", PlaceController.show);
router.get("/detail/:id", PlaceController.detail);
router.get("/form/create", PlaceFormController.createForm);
router.get("/form/edit/:id", PlaceFormController.editForm);
router.get("/form/upload/:id", PlaceFormController.uploadForm);
router.get("/list", PlaceController.list);
router.get("/:id/nearest-activity", PlaceController.nearestActivity);
router.get("/:id/nearest-beaches", PlaceController.nearestBeaches);
router.get("/:id/nearest-organizations", PlaceController.nearestOrganizations);

router.post("/create", PlaceController.create);
router.put("/:id", PlaceController.update);

router.put("/upload/:id", upload.fields([
    { name: "cover", maxCount: 1 },
    { name: "gallery[]", maxCount: 10 }
]), PlaceController.uploadPhoto);

router.put("/upload-video/:id", videoUpload.single("video"), PlaceController.uploadVideo);

router.delete("/:id/delete-video", PlaceController.deleteVideo);
router.delete("/:id/photo", PlaceController.deletePhoto);
router.delete("/:id", PlaceController.del);

export default router;
