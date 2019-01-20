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
 //   console.log(q);
    return query(q);
};

DataBase.prototype.getRandomCards = function (topic, used = [], count = 1) {
  //  console.log(`get ${count} random cards of ${topic}`);
    return this.getCards(topic).then((rows) => {
        var response = '';
        if (topic === 'whitecard') {
            response = getRandom(rows.map(r => r.value), used, count);
        } else {
            response = getRandom(rows.map(r => JSON.parse(r.value)), used)[0];
        }
        return response;
    });
};

DataBase.prototype.getCards = function (topic) {
    const q = `SELECT value FROM cards where type = "${topic}";`;
    //console.log(q);
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

function getRandom(arr, taken, n = 1) {
    var result = [];
    if ((n + taken.length) > arr.length)
        throw new RangeError("getRandom: more elements taken than available");
    while (n) {
        var i = Math.floor(Math.random() * arr.length);
        if (!result.includes(arr[i]) && !taken.includes(arr[i])) {
          /*   console.log(arr[i],"is not in",result,"or",taken); */
            result.push(arr[i]);
            n--;
        }
    }
    return result;
}

module.exports = DataBase;