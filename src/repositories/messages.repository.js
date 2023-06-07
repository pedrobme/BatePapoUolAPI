import { messagesCollection } from "../config/database.js";

const insertOneMessage = async (messageObject) => {
	const addedMessage = await messagesCollection.insertOne(messageObject);

	return addedMessage;
};

const getAllMessages = async () => {
	const allMessages = await messagesCollection.find({}).toArray();

	return allMessages;
};

const messagesRepository = { insertOneMessage, getAllMessages };

export default messagesRepository;
