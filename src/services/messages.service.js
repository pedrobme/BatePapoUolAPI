import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";
import messagesRepository from "../repositories/messages.repository.js";

dayjs.extend(utc);
dayjs.extend(timezone);

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
		time: dayjs().tz("America/Fortaleza").format("HH:mm:ss"),
	};

	await messagesRepository.insertOneMessage(messageObject);
};

const messagesService = {
	demandAllUserMessages,
	demandLimitedNumberOfUserMessages,
	demandNewMessageInsertion,
};

export default messagesService;
