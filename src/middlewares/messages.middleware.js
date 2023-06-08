import { newMessageSchema } from "../config/schemas.js";

const validateMessage = (req, res, next) => {
	const newMessage = req.body;

	const validation = newMessageSchema.validate(newMessage, {
		abortEarly: false,
	});

	if (validation.error) {
		const errors = validation.error.details.map((detail) => detail.message);
		res.status(422).send(errors);
		return;
	}

	next();
};

export default validateMessage;
