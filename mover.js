var fs = require("fs");
const DataBase = require("./src/server/DataBaseMongo");
const db = new DataBase();

var text = fs.readFileSync("./whites").toString('utf-8');;

var cards = text.split("\r\n");

f();



async function f() {
    for (let index = 0; index < cards.length; index++) {
        const card = cards[index];
        await db.addCard('whitecard', card)
    }
}