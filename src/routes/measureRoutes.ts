import { Router } from "express";
import * as measureController from "../controllers/measureController";

const router = Router();

router.post("/upload", measureController.createMeasure);
router.get("/:id/list", measureController.getAllCustomerMeasures);
router.patch("/confirm", measureController.confirmMeasure);

export default router;
