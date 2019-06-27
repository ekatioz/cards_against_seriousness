var fs = require("fs");
const DataBase = require("./src/server/DataBaseMongo");
const db = new DataBase();

var text = fs.readFileSync("./blacks").toString('utf-8');;

var cards = text.split("\r\n");

f();



async function f() {
    for (let index = 0; index < cards.length; index++) {
        const card = cards[index];
        console.log(card);
        await db.addCard('blackcard', card)
    }
}
/* 
db.addCard('blackcard', 'In dieser Folge von "Abenteuer Survival" muss Bear Grylls in den Tiefen des Amazonas nur mit %w und seinem Verstand überleben.')
