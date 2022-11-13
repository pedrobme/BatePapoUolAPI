import express from "express";
import { newMessageSchema, newParticipantSchema } from "./schemas.js";
import dayjs from "dayjs";
import { MongoClient } from "mongodb";

const app = express();
app.use(express.json());

const mongoClient = new MongoClient("mongodb://localhost:27017");
let db;

try {
  await mongoClient.connect();
  db = mongoClient.db("UOL");
  console.log("Mongo server connected");
} catch (error) {
  console.log(error);
}

let participantsCollection = db.collection("participants");
let messagesCollection = db.collection("messages");

app.post("/participants", async (req, res) => {
  const newParticipant = req.body;

  const validation = newParticipantSchema.validate(newParticipant, {
    abortEarly: false,
  });

  if (validation.error) {
    const errors = validation.error.details.map((detail) => detail.message);
    res.status(422).send(errors);
    return;
  }

  try {
    const nameAlreadyInUse = await participantsCollection.findOne({
      name: newParticipant.name,
    });
    if (nameAlreadyInUse) {
      res
        .status(409)
        .send("Name is already in use, please choose another name");
      return;
    }
  } catch (serverError) {
    res.status(500).send(serverError);
  }

  await participantsCollection.insertOne({
    ...newParticipant,
    lastStatus: Date.now(),
  });

  await messagesCollection.insertOne({
    from: newParticipant.name,
    to: "Todos",
    text: "entra na sala...",
    type: "status",
    time: dayjs().format("HH:mm:ss"),
  });

  try {
    console.log(
      "messages collection:",
      await messagesCollection.find({}).toArray()
    );
    console.log(
      "participants collection:",
      await participantsCollection.find({}).toArray()
    );
  } catch (erro) {
    console.log(erro);
  }

  res.sendStatus(201);
});

app.get("/participants", async (req, res) => {
  try {
    const participantsList = await participantsCollection.find({}).toArray();
    res.status(201).send(participantsList);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post("/messages", async (req, res) => {
  const newMessage = req.body;
  const sender = req.headers.user;

  const validation = newMessageSchema.validate(newMessage, {
    abortEarly: false,
  });

  if (validation.error) {
    const errors = validation.error.details.map((detail) => detail.message);
    res.status(422).send(errors);
    return;
  }

  const senderExists = await participantsCollection.findOne({ name: sender });

  if (!senderExists) {
    res
      .status(422)
      .send("user is not logged in, please refresh your connection");
    return;
  }

  messagesCollection.insertOne({
    ...newMessage,
    from: sender,
    time: dayjs().format("HH:mm:ss"),
  });

  try {
    console.log(
      "messages collection:",
      await messagesCollection.find({}).toArray()
    );
  } catch (erro) {
    console.log(erro);
  }

  res.sendStatus(201);
});

app.get("/messages", async (req, res) => {
  const username = req.headers.user;
  const messagesList = await messagesCollection.find({}).toArray();

  if (req.query.limit < 1 || req.query.limit > messagesList.length) {
    res.status(400).send("invalid limit");
    return;
  }

  const userMessages = messagesList.filter((messageObj) => {
    if (messageObj.type === "private_message") {
      return messageObj.to === username || messageObj.from === username;
    }
    return true;
  });

  if (!req.query.limit) {
    res.status(201).send(userMessages);
    return;
  }

  const limitedUserMessagesList = messagesList.slice(
    messagesList.length - req.query.limit
  );

  res.status(200).send(limitedUserMessagesList);
});

app.post("/status", (req, res) => {
  const username = req.headers.user;

  const userIsLoggedIn = participantsCollection.findOne({ name: username });

  if (!userIsLoggedIn) {
    res.sendStatus(404);
    return;
  }

  res.sendStatus(200);
});

app.listen(5000, () => console.log("server running at port 5000"));
