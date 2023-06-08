import express from "express";
import cors from "cors";
import participantsRouter from "./routers/participants.router.js";
import messagesRouter from "./routers/messages.router.js";
import statusRouter from "./routers/statusRouter.js";
import { participantsCollection } from "./config/database.js";

const app = express();
app.use(express.json());
app.use(cors());

// Routes

app
	.get("/health", (_req, res) => res.send("OK!"))
	.use("/participants", participantsRouter)
	.use("/messages", messagesRouter)
	.use("/status", statusRouter);

setInterval(async () => {
	try {
		const participantsList = await participantsCollection.find({}).toArray();
		const expiredLoginParticipants = participantsList.filter((participant) => {
			return participant.lastStatus < Date.now() - 10000;
		});

		expiredLoginParticipants.forEach(async (participant) => {
			await participantsCollection.deleteOne({ _id: participant._id });
		});

		console.log("iddle participants deleted successfully");
	} catch (error) {
		console.log(error);
	}
}, 15000);

app.listen(5000, () => console.log("server running at port 5000"));
