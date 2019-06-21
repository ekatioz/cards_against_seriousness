const { msgType } = require('../commonStrings');
const MongoClient = require('mongodb').MongoClient;
const mongoUrl = 'mongodb://192.168.188.36:27017';

function DataBase() {
    this.whitecards = [];
    this.blackcards = [];
}


DataBase.prototype.addCard = function (topic, text) {
   return MongoClient.connect(mongoUrl, { useNewUrlParser: true })
        .then(db => {
            var dbo = db.db("cards");
            var card = { value: text };
            dbo.collection(`${topic}s`).insertOne(card)
            .then(() => db.close());
        });
};

DataBase.prototype.reloadCards = function () {
    const promiseWhite = this.getCards(msgType.whitecard).then((rows) => {
        this.whitecards = shuffle(rows.map(r => r.value));
        console.log('loaded', this.whitecards.length, 'whitecards');
    }).catch(err => console.error(err));
    const promiseBlack = this.getCards(msgType.blackcard).then((rows) => {
        this.blackcards = shuffle(rows.map(r => r.value));
        console.log('loaded', this.blackcards.length, 'blackcards');
    }).catch(err => console.error(err));

    return Promise.all([promiseWhite, promiseBlack])
        .then(() => (
            {
                whitecards: this.whitecards.length,
                blackcards: this.blackcards.length
            }));
};

DataBase.prototype.getRandomCards = function (topic, count = 1) {
    return topic === 'whitecard'
        ? this.whitecards.splice(0, count)
        : this.blackcards.splice(0, count)[0];
};

DataBase.prototype.getCards = function (topic) {
    return MongoClient.connect(mongoUrl, { useNewUrlParser: true })
        .then(db => {
            var dbo = db.db("cards");
            return dbo.collection(`${topic}s`).find({}).toArray()
                .then(result => {
                    db.close();
                    return result;
                });
        });
};



function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

module.exports = DataBase;