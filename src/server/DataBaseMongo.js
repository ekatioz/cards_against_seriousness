const { msgType } = require('../commonStrings');
const MongoClient = require('mongodb').MongoClient;
const mongoUrl = 'mongodb://cardsuser:jla3vw39y@dockerhost:27017/cards';

function DataBase() {
    this.whitecards = [];
    this.blackcards = [];
}


DataBase.prototype.addCard = function (topic, text) {
    throw new Error('not implemented yet');
};

DataBase.prototype.reloadCards = function () {
    const promiseWhite = this.getCards(msgType.whitecard).then((rows) => {
        this.whitecards = shuffle(rows.map(r => r.value));
        console.log('loaded', this.whitecards.length, 'whitecards');
    });
    const promiseBlack = this.getCards(msgType.blackcard).then((rows) => {
        this.blackcards = shuffle(rows.map(r => JSON.parse(r.value)));
        console.log('loaded', this.blackcards.length, 'blackcards');
    });

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
    return new Promise((res, rej) => {
        MongoClient.connect(mongoUrl, { useNewUrlParser: true })
            .then(db => {
                var dbo = db.db("cards");
                dbo.collection(`${topic}s`).find({}).toArray()
                    .then(result => {
                        res(result);
                        db.close();
                    })
                    .catch(err => rej(err));
            })
            .catch(err => rej(err));
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