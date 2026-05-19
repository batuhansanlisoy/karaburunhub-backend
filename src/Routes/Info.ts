import { Router } from "express";
import { showPrivacy } from "~/Controller/Info";

const router = Router();

router.get("/privacy", showPrivacy);

export default router;
