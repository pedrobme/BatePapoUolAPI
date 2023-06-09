import messagesService from "../services/messages.service.js";

const tryToGetUserMessagesList = async (req, res) => {
	try {
		const userId = req.headers["user-id"];
		const numberOfDisplayedMessages = req.query.limit;

		let userMessages;

		if (!numberOfDisplayedMessages) {
			userMessages = await messagesService.demandAllUserMessages(userId);
		}

		userMessages = await messagesService.demandLimitedNumberOfUserMessages(
			userId,
			numberOfDisplayedMessages
		);

		res.status(200).send(userMessages);
	} catch (err) {
		if (err.name === "badRequest") {
			res.status(400).send(err.message);
		} else {
			res.status(500).send(err.message);
		}
	}
};

const tryToInsertOneMessage = async (req, res) => {
	try {
		const newMessage = req.body;
		const sender = req.headers.user;
		const senderId = req.headers["sender-id"];
		const receiverId = req.headers["receiver-id"];

		messagesService.demandNewMessageInsertion(
			sender,
			senderId,
			receiverId,
			newMessage
		);

		res.sendStatus(201);
	} catch (err) {
		res.status(500).send(err.message);
	}
};

const messagesController = { tryToGetUserMessagesList, tryToInsertOneMessage };

export default messagesController;
