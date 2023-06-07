import messagesService from "../services/messages.service.js";

const tryToGetUserMessagesList = async (req, res) => {
	try {
		const username = req.headers.user;
		const numberOfDisplayedMessages = req.query.limit;

		console.log(numberOfDisplayedMessages);
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

const messagesController = { tryToGetUserMessagesList };

export default messagesController;
