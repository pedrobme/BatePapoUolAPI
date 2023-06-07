import { newParticipantSchema } from "../config/schemas.js";

const validateParticipant = (req, res, next) => {
	const participantObject = req.body;

	const validation = newParticipantSchema.validate(participantObject, {
		abortEarly: false,
	});

	if (validation.error) {
		const errors = validation.error.details.map((detail) => detail.message);
		res.status(422).send(errors);
		return;
	}

	next();
};

export default validateParticipant;
