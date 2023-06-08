import participantsRepository from "../repositories/participants.repository.js";
import participantsService from "../services/participants.service.js";

const tryToInsertOneNewParticipant = async (req, res) => {
	try {
		const newParticipantObject = req.body;

		await participantsService.verifyIfNewPaticipantNameAlreadyExists(
			newParticipantObject.name
		);

		const addedParticipant =
			await participantsService.demandOneParticipantInsertion(
				newParticipantObject
			);

		res.status(201).send(addedParticipant);
	} catch (err) {
		if (err.name === "conflictError") {
			res.status(409).send(err.message);
		} else {
			res.status(500).send(err.message);
		}
	}
};

const tryToGetAllParticipantsList = async (req, res) => {
	try {
		const allParticipantsList =
			await participantsService.demandAllParticipantsList();

		res.status(200).send(allParticipantsList);
	} catch (err) {
		res.status(500).send(err.message);
	}
};

const checkIfParticipantIsActive = async (req, res, next) => {
	try {
		const username = req.headers.user;

		const usernameIsActive =
			await participantsService.demandOneParticipantByName(username);

		if (!usernameIsActive) {
			throw {
				name: "unprocessableEntity",
				message: "User is not logged in, please refresh your connection",
			};
		}

		next();
	} catch (err) {
		if (err.name === "unprocessableEntity") {
			res.status(422).send(err.message);
		} else {
			res.status(500).send(err.message);
		}
	}
};

const updateUserStatus = async (req, res) => {
	try {
		const username = req.headers.user;

		const userObject = await participantsService.demandOneParticipantByName(
			username
		);

		await participantsRepository.updateOneParticipantStatus(userObject);

		res.sendStatus(200);
	} catch (err) {
		res.status(500).send(err.message);
	}
};

const participantsController = {
	tryToInsertOneNewParticipant,
	tryToGetAllParticipantsList,
	checkIfParticipantIsActive,
	updateUserStatus,
};

export default participantsController;
