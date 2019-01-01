const mysql = require('mysql')
const connection = mysql.createConnection({
    host: 'raspberrypi',
    user: 'root',
    password: 'jla3vw39y',
    database: 'cards_against'
});

function DataBase() {
}

DataBase.prototype.getCards = function (topic, count,callback) {
    const query = `SELECT value FROM cards where type = "${topic}";`;
    console.log(query);
    connection.query(query, (err, rows) => {
        if (err) throw err;
        var response = '';
        if (topic === 'whitecard') {
            response = getRandom(rows.map(r => r.value), count);
        } else {
            response = getRandom(rows.map(r => JSON.parse(r.value)))[0];
        }
        callback(response)
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