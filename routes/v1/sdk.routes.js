import { Router } from "express";

import { getLLMResponse, createChat } from "../../controllers/sdk/chat.controller";
import { verifyApiKey } from "../../middleware/sdk.middleware";

var router = Router();

router.post("/chat/getresponse", verifyApiKey, getLLMResponse);
router.post("/chat/create", verifyApiKey, createChat);

export default router;
