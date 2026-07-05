import { Router } from "express";
import { verifyAuth } from "../../../Middlewares/auth.middleware.js";
import { getChatHistory } from "../Controllers/message.controller.js";

const messageRouter = Router();

messageRouter.get("/:matchId", verifyAuth, getChatHistory);

export default messageRouter;
