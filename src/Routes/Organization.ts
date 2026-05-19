import { Router } from "express";
import { R2Service } from "~/Service/R2";
import { FileService } from "~/Service/File";
import * as OrganizationController from "~/Controller/Organization";
import * as OrganizationFormController from "~/Controller/Organization/Form";

const router = Router();

const upload = FileService.uploader();
const videoUpload = R2Service.videoStreamUploader("organization");

router.get("", OrganizationController.show);
router.get("/detail/:id", OrganizationController.detail);
router.get("/form/create", OrganizationFormController.createForm);
router.get("/form/edit/:id", OrganizationFormController.editForm);
router.get("/form/upload/:id", OrganizationFormController.uploadForm);
router.get("/list", OrganizationController.list);
router.get("/:id/single", OrganizationController.single);
router.get("/:id/nearest-activity", OrganizationController.nearestActivity);
router.get("/:id/nearest-places", OrganizationController.nearestPlaces);
router.get("/:id/nearest-beaches", OrganizationController.nearestBeaches);

router.post("/create", OrganizationController.create);
router.patch("/:id/highlight", OrganizationController.highligt);
router.patch("/:id/activation", OrganizationController.activation);

router.put("/:id", OrganizationController.update);
router.put("/upload/:id", upload.fields([
    { name: "cover", maxCount: 1 },
    { name: "gallery[]", maxCount: 10 }
]), OrganizationController.uploadPhoto);

router.put("/upload-video/:id", videoUpload.single("video"), OrganizationController.uploadVideo);

router.delete("/:id/delete-video", OrganizationController.deleteVideo);
router.delete("/:id/photo", OrganizationController.deletePhoto);
router.delete("/:id", OrganizationController.del);

export default router;
