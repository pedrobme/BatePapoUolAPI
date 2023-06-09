import { MongoClient } from "mongodb";

const mongoClient = new MongoClient(
	"mongodb+srv://pedrobme:eiNI9UGd6ZPZH8B6@batepapodb.eqjmedd.mongodb.net/?retryWrites=true&w=majority"
);
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
