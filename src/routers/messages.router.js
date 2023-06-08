import { Router } from "express";
import messagesController from "../controllers/messages.controller.js";
import participantsController from "../controllers/participants.controller.js";
import validateMessage from "../middlewares/messages.middleware.js";

const messagesRouter = Router();

messagesRouter
	.get("/", messagesController.tryToGetUserMessagesList)
	.post(
		"/",
		validateMessage,
		participantsController.checkIfParticipantIsActive,
		messagesController.tryToInsertOneMessage
	);

export default messagesRouter;
