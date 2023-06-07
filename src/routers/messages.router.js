import { Router } from "express";
import messagesController from "../controllers/messages.controller.js";

const messagesRouter = Router();

messagesRouter.get("/", messagesController.tryToGetUserMessagesList);

export default messagesRouter;
