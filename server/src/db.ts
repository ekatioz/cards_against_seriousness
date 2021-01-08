import shuffle from "shuffle-array";
import { MongoClient, ObjectId } from "mongodb";
import { Topic } from "./Topic";

const mongoUrl = process.env.MONGO_SERVER_URI;
function connect() {
  return MongoClient.connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}

export function addCard(topic: Topic, text: string) {
  return connect().then((db) => {
    const dbo = db.db("cards");
    const card = { value: text };
    dbo
      .collection(topic.toString())
      .insertOne(card)
      .then(() => db.close());
  });
}

export function deleteCard(topic: Topic, id: string) {
  return connect().then((db) => {
    const dbo = db.db("cards");
    const card = { _id: new ObjectId(id) };
    dbo
      .collection(topic.toString())
      .deleteOne(card)
      .then(() => db.close());
  });
}

export interface Card { id: string; text: string }

export function getCards(topic: Topic): Promise<Card[]> {
  return connect().then((db) => {
    const dbo = db.db("cards");
    return dbo
      .collection(topic.toString())
      .find()
      // eslint-disable-next-line no-underscore-dangle
      .map((x: any) => ({ ...x, value: { text: x.value, id: x._id.toString() } }))
      .toArray()
      .then((result: { value: Card }[]) => {
        db.close();
        return shuffle(result.map((r) => r.value));
      });
  });
}
