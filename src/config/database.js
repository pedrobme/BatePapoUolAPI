import { MongoClient } from "mongodb";

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

export { participantsCollection, messagesCollection };
