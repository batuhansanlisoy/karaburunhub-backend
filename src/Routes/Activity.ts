import { Router } from "express";
import { show, list, create, del, update, uploadPhoto, timeline} from "../Controller/Activity";
import { createForm, editForm, uploadForm } from "../Controller/Activity/Form";
import { FileService } from "../Service/File";

const router = Router();

// 🔥 Activity için memory uploader kullanıyoruz
const upload = FileService.uploader("activity");

router.get("", show);
router.get("/form/create", createForm);
router.get("/form/edit/:id", editForm);
router.get("/form/upload/:id", uploadForm);
router.get("/list", list);

router.post("/create",create);

router.put("/:id", update);
router.put("/timeline/:id", timeline);
router.put("/upload/:id", upload.fields([
    { name: "cover", maxCount: 1 },
    { name: "gallery[]", maxCount: 10 }
]), uploadPhoto);

router.delete("/:id", del);

export default router;
