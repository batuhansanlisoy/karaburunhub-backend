import { Router } from "express";
import { R2Service } from "~/Service/R2";
import { FileService } from "~/Service/File";
import * as LocalProducerController from "~/Controller/LocalProducer";
import * as LocalProducerFormController from "~/Controller/LocalProducer/Form";

const router = Router();

const upload = FileService.uploader();
const videoUpload = R2Service.videoStreamUploader("local_producer");

router.get("", LocalProducerController.show);
router.get("/detail/:id", LocalProducerController.detail);
router.get("/form/create", LocalProducerFormController.createForm);
router.get("/form/edit/:id", LocalProducerFormController.editForm);
router.get("/form/upload/:id", LocalProducerFormController.uploadForm);
router.get("/list", LocalProducerController.list);

router.post("/create", LocalProducerController.create);

router.patch("/:id/highlight", LocalProducerController.highlight);
router.patch("/:id/activation", LocalProducerController.activation);

router.put("/:id", LocalProducerController.update);

router.put("/upload/:id", upload.fields([
    { name: "cover", maxCount: 1 },
    { name: "gallery[]", maxCount: 10 }
]), LocalProducerController.uploadPhoto);

router.put("/upload-video/:id", videoUpload.single("video"), LocalProducerController.uploadVideo);

router.delete("/:id/delete-video", LocalProducerController.deleteVideo);
router.delete("/:id/photo", LocalProducerController.deletePhoto);
router.delete("/:id", LocalProducerController.del);

export default router;
