import messagesRepository from "../repositories/messages.repository.js";

const demandAllUserMessages = async (username) => {
	const allMessagesList = await messagesRepository.getAllMessages();

	const userMessagesList = allMessagesList.filter((messageObj) => {
		if (messageObj.type === "private_message") {
			return messageObj.to === username || messageObj.from === username;
		}

		return true;
	});

	return userMessagesList;
};

const demandLimitedNumberOfUserMessages = async (username, limitNumber) => {
	const allMessagesList = await messagesRepository.getAllMessages();

	if (limitNumber < 1 || limitNumber > allMessagesList.length) {
		throw {
			name: "badRequest",
			message:
				"Invalid limit number, the number must be between 1 and the total of messages avaible.",
		};
	}

	const userMessages = allMessagesList.filter((messageObj) => {
		if (messageObj.type === "private_message") {
			return messageObj.to === username || messageObj.from === username;
		}

		return true;
	});

	const reducedUserMessagesList = userMessages.slice(
		allMessagesList.length - limitNumber
	);

	return reducedUserMessagesList;
};

const messagesService = {
	demandAllUserMessages,
	demandLimitedNumberOfUserMessages,
};

export default messagesService;
