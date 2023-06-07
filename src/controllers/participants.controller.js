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

const participantsController = {
	tryToInsertOneNewParticipant,
	tryToGetAllParticipantsList,
};

export default participantsController;
