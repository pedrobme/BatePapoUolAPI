import dayjs from "dayjs";
import messagesRepository from "../repositories/messages.repository.js";
import participantsRepository from "../repositories/participants.repository.js";

const verifyIfNewPaticipantNameAlreadyExists = async (newParticipantName) => {
	const nameAlreadyInUse = await participantsRepository.findParticipantByName(
		newParticipantName
	);

	if (nameAlreadyInUse) {
		throw {
			name: "conflictError",
			message: "Name is already in use, please choose another name",
		};
	}
};

const demandOneParticipantInsertion = (newParticipantObject) => {
	const addedParticipant =
		participantsRepository.insertOneParticipant(newParticipantObject);

	const newMessage = {
		from: newParticipantObject.name,
		to: "Todos",
		text: "entra na sala...",
		type: "status",
		time: dayjs().format("HH:mm:ss"),
	};

	messagesRepository.insertOneMessage(newMessage);

	return addedParticipant;
};

const demandAllParticipantsList = () => {
	const allParticipantsList = participantsRepository.findAllParticipants();

	return allParticipantsList;
};

const participantsService = {
	verifyIfNewPaticipantNameAlreadyExists,
	demandOneParticipantInsertion,
	demandAllParticipantsList,
};

export default participantsService;
