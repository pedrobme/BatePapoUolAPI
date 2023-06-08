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

const updateOneParticipantStatus = async (userObject) => {
	const updatedUser = await participantsCollection.updateOne(
		{ _id: userObject._id },
		{ $set: { lastStatus: Date.now() } }
	);

	return updatedUser;
};

const participantsRepository = {
	findParticipantByName,
	insertOneParticipant,
	findAllParticipants,
	updateOneParticipantStatus,
};

export default participantsRepository;
