import { Router } from "express";
import participantsController from "../controllers/participants.controller.js";

const statusRouter = Router();

statusRouter.put(
	"/",
	participantsController.checkIfParticipantIsActive,
	participantsController.updateUserStatus
);

export default statusRouter;
