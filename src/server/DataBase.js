const { msgType } = require("../commonStrings");
const mysql = require("mysql");
const connection = mysql.createConnection({
  host: "raspberrypi",
  user: "root",
  password: "jla3vw39y",
  database: "cards_against"
});

function DataBase() {
  this.whitecards = [];
  this.blackcards = [];
}

DataBase.prototype.addCard = function(topic, text) {
  const q = `INSERT INTO cards(type,value) VALUES (${connection.escape(
    topic
  )},${connection.escape(text)});`;
  //   console.log(q);
  return query(q);
};

DataBase.prototype.reloadCards = function() {
  const promiseWhite = this.getCards(msgType.whitecard).then(rows => {
    this.whitecards = shuffle(rows.map(r => r.value));
    console.log("loaded", this.whitecards.length, "whitecards");
  });
  const promiseBlack = this.getCards(msgType.blackcard).then(rows => {
    this.blackcards = shuffle(rows.map(r => JSON.parse(r.value)));
    console.log("loaded", this.blackcards.length, "blackcards");
  });

  return Promise.all([promiseWhite, promiseBlack]).then(() => ({
    whitecards: this.whitecards.length,
    blackcards: this.blackcards.length
  }));
};

DataBase.prototype.getRandomCards = function(topic, count = 1) {
  return topic === "whitecard"
    ? this.whitecards.splice(0, count)
    : this.blackcards.splice(0, count)[0];
};

DataBase.prototype.getCards = function(topic) {
  return query(`SELECT value FROM cards where type = "${topic}";`);
};

function query(query) {
  return new Promise((res, rej) => {
    connection.query(query, (err, rows) => {
      if (err) rej(err);
      else res(rows);
    });
    // connection.end();
  });
}

function getRandom(arr, taken, n = 1) {
  var result = [];
  if (n + taken.length > arr.length)
    throw new RangeError("getRandom: more elements taken than available");
  while (n) {
    var i = Math.floor(Math.random() * arr.length);
    if (!result.includes(arr[i]) && !taken.includes(arr[i])) {
      result.push(arr[i]);
      n--;
    }
  }
  return result;
}

function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

module.exports = DataBase;
