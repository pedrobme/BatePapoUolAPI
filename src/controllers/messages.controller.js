import messagesRepository from "../repositories/messages.repository.js";
import messagesService from "../services/messages.service.js";

const tryToGetUserMessagesList = async (req, res) => {
	try {
		const username = req.headers.user;
		const numberOfDisplayedMessages = req.query.limit;

		let userMessages;

		if (!numberOfDisplayedMessages) {
			userMessages = await messagesService.demandAllUserMessages(username);
		}

		userMessages = await messagesService.demandLimitedNumberOfUserMessages(
			username,
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

		messagesService.demandNewMessageInsertion(sender, newMessage);

		res.sendStatus(201);
	} catch (err) {
		res.status(500).send(err.message);
	}
};

const messagesController = { tryToGetUserMessagesList, tryToInsertOneMessage };

export default messagesController;
