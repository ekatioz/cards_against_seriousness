const mysql = require('mysql');
const connection = mysql.createConnection({
    host: 'raspberrypi',
    user: 'root',
    password: 'jla3vw39y',
    database: 'cards_against'
});

function DataBase() {
}

DataBase.prototype.addCard = function (topic, text) {
    const q = `INSERT INTO cards(type,value) VALUES (${connection.escape(topic)},${connection.escape(text)});`;
    console.log(q);
    return query(q);
};

DataBase.prototype.getRandomCards = function (topic, count = 1) {
    console.log(`get ${count} random cards of ${topic}`);
    return this.getCards(topic).then((rows) => {
        var response = '';
        if (topic === 'whitecard') {
            response = getRandom(rows.map(r => r.value), count);
        } else {
            response = getRandom(rows.map(r => JSON.parse(r.value)))[0];
        }
        return response;
    });
};

DataBase.prototype.getCards = function (topic) {
    const q = `SELECT value FROM cards where type = "${topic}";`;
    console.log(q);
    return query(q);
};

function query(query) {
    return new Promise((res, rej) => {
        connection.query(query, (err, rows) => {
            if (err) rej(err);
            else res(rows);
        });
    });
}

function getRandom(arr, n = 1) {
    var result = new Array(n),
        len = arr.length,
        taken = new Array(len);
    if (n > len)
        throw new RangeError("getRandom: more elements taken than available");
    while (n--) {
        var x = Math.floor(Math.random() * len);
        result[n] = arr[x in taken ? taken[x] : x];
        taken[x] = --len in taken ? taken[len] : len;
    }
    return result;
}

module.exports = DataBase;