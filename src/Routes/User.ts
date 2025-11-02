import { Router } from "express";
import { listUsers, addUser } from "../Controller/User";

const router = Router();

router.get("/", listUsers);
router.post("/", addUser);

export default router;
