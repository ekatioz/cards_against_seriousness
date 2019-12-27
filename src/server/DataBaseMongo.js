const shuffle = require("shuffle-array");
const { msgType } = require("../commonStrings");
const {MongoClient, ObjectId} = require("mongodb");
const mongoUrl = process.env.MONGO_SERVER;

function DataBase() {
  this.whitecards = [];
  this.blackcards = [];
}

DataBase.prototype.addCard = function (topic, text) {
  return MongoClient.connect(mongoUrl, { useNewUrlParser: true }).then(db => {
    var dbo = db.db("cards");
    var card = { value: text };
    dbo
      .collection(`${topic}s`)
      .insertOne(card)
      .then(() => db.close());
  });
};

DataBase.prototype.deleteCard = function (topic, id) {
  return MongoClient.connect(mongoUrl, { useNewUrlParser: true }).then(db => {
    var dbo = db.db("cards");
    var card = { _id: ObjectId(id) };
    dbo
      .collection(`${topic}s`)
      .deleteOne(card)
      .then(() => db.close());
  });
};

DataBase.prototype.reloadCards = async function () {
  const promiseWhite = this.getCards(msgType.whitecard)
    .then(rows => {
      this.whitecards = shuffle(rows.map(r => r.value));
      console.log("loaded", this.whitecards.length, "whitecards");
    })
    .catch(err => console.error(err));
  const promiseBlack = this.getCards(msgType.blackcard)
    .then(rows => {
      this.blackcards = shuffle(rows.map(r => r.value));
      console.log("loaded", this.blackcards.length, "blackcards");
    })
    .catch(err => console.error(err));

  await Promise.all([promiseWhite, promiseBlack]);
  return ({
    whitecards: this.whitecards.length,
    blackcards: this.blackcards.length
  });
};

DataBase.prototype.getRandomCards = function (topic, count = 1) {
  return topic === "whitecard"
    ? this.whitecards.splice(0, count)
    : this.blackcards.splice(0, count);
};

DataBase.prototype.getCards = function (topic) {
  return MongoClient.connect(mongoUrl, { useNewUrlParser: true }).then(db => {
    var dbo = db.db("cards");
    return dbo
      .collection(`${topic}s`)
      .find({})
      .toArray()
      .then(result => {
        db.close();
        return result;
      });
  });
};

module.exports = DataBase;
