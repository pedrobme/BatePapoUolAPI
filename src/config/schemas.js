import joi from "joi";

export const newParticipantSchema = joi.object({
  name: joi.string().required(),
});

export const newMessageSchema = joi.object({
  to: joi.string().required(),
  text: joi.string().required(),
  type: joi.string().required().valid("private_message", "message"),
});
