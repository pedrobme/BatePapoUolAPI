import { participantsCollection } from "../config/database.js";

const findParticipantByName = async (name) => {
	const participantObject = await participantsCollection.findOne({
		name: name,
	});

	return participantObject;
};

const insertOneParticipant = async (newParticipant) => {
	const addedParticipant = await participantsCollection.insertOne({
		...newParticipant,
		lastStatus: Date.now(),
	});

	return addedParticipant;
};

const findAllParticipants = async () => {
	const participantsList = await participantsCollection.find({}).toArray();

	return participantsList;
};

const participantsRepository = {
	findParticipantByName,
	insertOneParticipant,
	findAllParticipants,
};

export default participantsRepository;
