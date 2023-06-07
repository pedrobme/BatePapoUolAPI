import { Router } from "express";
import participantsController from "../controllers/participants.controller.js";
import validateParticipant from "../middlewares/participants.middleware.js";

const participantsRouter = Router();

participantsRouter
	.post(
		"/",
		validateParticipant,
		participantsController.tryToInsertOneNewParticipant
	)
	.get("/", participantsController.tryToGetAllParticipantsList);

export default participantsRouter;
