import { messagesCollection } from "../config/database.js";

const insertOneMessage = async (messageObject) => {
	const addedMessage = await messagesCollection.insertOne(messageObject);

	return addedMessage;
};

const getAllUserMessages = async (userId) => {
	const query = {
		$or: [{ senderId: userId }, { receiverId: userId }, { to: "Todos" }],
	};

	const allMessages = await messagesCollection.find(query).toArray();

	return allMessages;
};

const getAllUserMessagesWithLimit = async (userId, limitNumber) => {
	const query = {
		$or: [{ senderId: userId }, { receiverId: userId }, { to: "Todos" }],
	};

	const options = { limit: limitNumber };

	const allMessages = await messagesCollection.find(query, options).toArray();

	return allMessages;
};

const messagesRepository = {
	insertOneMessage,
	getAllUserMessages,
	getAllUserMessagesWithLimit,
};

export default messagesRepository;
