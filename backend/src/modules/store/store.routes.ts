import { Router } from "express";
import * as controller from "./store.controller";
import { requireAuth } from "../../middlewares/requireAuth";
import { requireRole } from "../../middlewares/requireRole";
import { requireOwnership } from "../../middlewares/requireOwnership";

const router = Router();
//create stoew
router.post("/", requireAuth, requireRole("VENDOR"), controller.create);
//get own stores
router.get("/my", requireAuth, requireRole("VENDOR"), controller.myStores);
//dmin get allstores
router.get("/", requireAuth, requireRole("ADMIN"), controller.getAll);
router.put("/:id", requireAuth, requireOwnership, controller.update);
router.delete("/:id", requireAuth, requireOwnership, controller.remove);

export default router;
