import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "../../.env") });

const MONGO_DB_URI = process.env.MONGO_DB_URI;

const mongoClient = new MongoClient(MONGO_DB_URI);
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
