var fs = require("fs");
const DataBase = require("./src/server/DataBaseMongo");
const db = new DataBase();


db.addCard('blackcard', 'In dieser Folge von "Abenteuer Survival" muss Bear Grylls in den Tiefen des Amazonas nur mit %w und seinem Verstand überleben.')
