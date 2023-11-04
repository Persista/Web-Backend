import { Router } from "express";
import adminRouter from "./admin/index.js";
import authRouter from "./auth.routes.js";
import actionsRoter from "./actions.routes.js";
import sdkRouter from "./sdk.routes.js";
import { verifyAdmin, verifyUser } from "../../middleware/auth.middleware.js";
import  { verifyApiKey } from "../../middleware/sdk.middleware.js";
import { createProject } from "../../controllers/admin.controller.js";

var router = Router();

router.use("/admin", verifyAdmin, adminRouter);
router.use("/auth", authRouter);
router.post("/project", verifyUser, createProject);
router.use("/actions", verifyUser, actionsRoter);
router.use("/sdk", verifyApiKey, sdkRouter);


export default router;
