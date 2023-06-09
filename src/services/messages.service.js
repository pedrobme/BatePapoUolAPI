import dayjs from "dayjs";
import messagesRepository from "../repositories/messages.repository.js";

const demandAllUserMessages = async (userId) => {
	const allMessagesList = await messagesRepository.getAllUserMessages(userId);

	return allMessagesList;
};

const demandLimitedNumberOfUserMessages = async (userId, limitNumber) => {
	const allUserMessagesList =
		await messagesRepository.getAllUserMessagesWithLimit(userId, limitNumber);

	return allUserMessagesList;
};

const demandNewMessageInsertion = async (
	sender,
	senderId,
	receiverId,
	newMessage
) => {
	const messageObject = {
		...newMessage,
		from: sender,
		senderId: senderId,
		receiverId: receiverId,
		time: dayjs().format("HH:mm:ss"),
	};

	await messagesRepository.insertOneMessage(messageObject);
};

const messagesService = {
	demandAllUserMessages,
	demandLimitedNumberOfUserMessages,
	demandNewMessageInsertion,
};

export default messagesService;
