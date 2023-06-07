import { messagesCollection } from "../config/database.js";

const insertOneMessage = async (messageObject) => {
	const addedMessage = await messagesCollection.insertOne(messageObject);
};

const messagesRepository = { insertOneMessage };

export default messagesRepository;
