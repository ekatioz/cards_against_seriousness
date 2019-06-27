var fs = require("fs");
const DataBase = require("./src/server/DataBaseMongo");
const db = new DataBase();

const promiseWhite = db
  .getCards("whitecard")
  .then(rows => {
    return rows.map(r => r.value);
  })
  .catch(err => console.error(err));
const promiseBlack = db
  .getCards("blackcard")
  .then(rows => {
    return rows.map(r => r.value);
  })
  .catch(err => console.error(err));

Promise.all([promiseWhite, promiseBlack]).then(([whitecards, blackcards]) => {
  const b = blackcards.join("\n");
  const w = whitecards.join("\n");
  fs.writeFile("blackcards", b, err => console.log("blackcards done", err));
  fs.writeFile("whitecards", w, err => console.log("whitecards done", err));
});
