import express from "express";
import cors from "cors";
import participantsRouter from "./routers/participants.router.js";
import messagesRouter from "./routers/messages.router.js";

const app = express();
app.use(express.json());
app.use(cors());

// Routes

app
	.get("/health", (_req, res) => res.send("OK!"))
	.use("/participants", participantsRouter)
	.use("/messages", messagesRouter);

// app.post("/messages", async (req, res) => {
// 	const newMessage = req.body;
// 	const sender = req.headers.user;

// 	try {

// 		messagesCollection.insertOne({
// 			...newMessage,
// 			from: sender,
// 			time: dayjs().format("HH:mm:ss"),
// 		});

// 		res.sendStatus(201);
// 	} catch (findError) {
// 		console.log(findError);
// 		res.status(503).send("Database server is not responding");
// 		return;
// 	}
// });

// app.post("/status", async (req, res) => {
// 	const username = req.headers.user;

// 	try {
// 		const userIsLoggedIn = await participantsCollection.findOne({
// 			name: username,
// 		});

// 		if (!userIsLoggedIn) {
// 			res.sendStatus(404);
// 			return;
// 		}

// 		await participantsCollection.updateOne(
// 			{ _id: userIsLoggedIn._id },
// 			{ $set: { lastStatus: Date.now() } }
// 		);

// 		res.sendStatus(200);
// 	} catch (error) {
// 		console.log(error);
// 		res.status(503).send("Database server is not responding");
// 	}
// });

// setInterval(async () => {
// 	try {
// 		const participantsList = await participantsCollection.find({}).toArray();
// 		const expiredLoginParticipants = participantsList.filter((participant) => {
// 			return participant.lastStatus < Date.now() - 10000;
// 		});

// 		expiredLoginParticipants.forEach(async (participant) => {
// 			await participantsCollection.deleteOne({ _id: participant._id });
// 		});

// 		console.log("iddle participants deleted successfully");
// 	} catch (error) {
// 		console.log(error);
// 	}
// }, 15000);
app.listen(5000, () => console.log("server running at port 5000"));
