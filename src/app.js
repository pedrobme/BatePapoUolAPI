import express from "express";
import { newMessageSchema, newParticipantSchema } from "./schemas.js";
import dayjs from "dayjs";
import { MongoClient } from "mongodb";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

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

setInterval(async () => {
  try {
    const participantsList = await participantsCollection.find({}).toArray();
    const expiredLoginParticipants = participantsList.filter((participant) => {
      return participant.lastStatus < Date.now() - 10000;
    });
    expiredLoginParticipants.forEach(async (participant) => {
      await participantsCollection.deleteOne({ _id: participant._id });
    });
  } catch (error) {
    console.log(error);
  }
}, 15000);

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
  try {
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
  } catch (insertError) {
    console.log(insertError);
  }

  try {
    console.log(
      "messages collection:",
      await messagesCollection.find({}).toArray()
    );
    console.log(
      "participants collection:",
      await participantsCollection.find({}).toArray()
    );
  } catch (findError) {
    console.log(findError);
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

  try {
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

    res.sendStatus(201);
  } catch (findError) {
    console.log(findError);
    res.status(503).send("Database server is not responding");
    return;
  }
});

app.get("/messages", async (req, res) => {
  const username = req.headers.user;

  try {
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
  } catch (findError) {
    console.log(findError);
    res.status(503).send("Database server is not responding");
  }
});

app.post("/status", async (req, res) => {
  const username = req.headers.user;

  try {
    const userIsLoggedIn = await participantsCollection.findOne({
      name: username,
    });

    if (!userIsLoggedIn) {
      res.sendStatus(404);
      return;
    }

    await participantsCollection.updateOne(
      { _id: userIsLoggedIn._id },
      { $set: { lastStatus: Date.now() } }
    );

    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.status(503).send("Database server is not responding");
  }
});

app.listen(5000, () => console.log("server running at port 5000"));
