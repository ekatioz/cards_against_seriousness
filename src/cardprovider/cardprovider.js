const { join } = require('path');
const DataBase = require('../server/DataBase');
const express = require('express');
const app = express();
const db = new DataBase();

app.use(express.static(join(__dirname, 'public')));
app.setMaxListeners(1);

app.get('/update', (req, res) => {
    console.log('update')
    db.getCards('whitecard',rows => {
        res.send(JSON.stringify(rows.map(r => r.value)));
    });
});


app.get('/provide', (req, res) => {
    console.log(req.query.text);
    db.addCard('whitecard',req.query.text, () => res.send('done!'));
});


var server = app.listen(9080, () => {
    var host = server.address().address;
    var port = server.address().port;
    console.log("cardprovider listening at http://%s:%s", host, port);
});