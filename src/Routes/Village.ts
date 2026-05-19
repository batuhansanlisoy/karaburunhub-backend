import { Router } from "express";
import * as VillageController from "~/Controller/Village";
import { createForm } from "../Controller/Village/Form";

const router = Router();

router.get("", VillageController.show);
router.get("/form/create", createForm);
router.get("/map", VillageController.map);
router.get("/list", VillageController.list);
router.post("/create", VillageController.create);
router.delete("/:id", VillageController.del);

export default router;
