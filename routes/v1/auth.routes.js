import express from "express";
const router = express.Router();
import {
	gitHubRedirect,
	tokenTransfer,
} from "../../controllers/auth/githubAuth.controller.js";
import {
	googleLogin,
	googleCallback,
	handleGoogleCallback,
} from "../../controllers/auth/googleAuth.controller.js";

router.get("/google", googleLogin);
router.get("/google/callback", googleCallback, handleGoogleCallback);

router.get("/github", gitHubRedirect);
router.get("/github/callback", tokenTransfer);

export default router;
