const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 13700 });

var mysql = require('mysql')
var connection = mysql.createConnection({
    host: 'raspberrypi',
    user: 'root',
    password: 'jla3vw39y',
    database: 'cards_against'
});

// Broadcast to all.
wss.broadcast = data => {
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(data);
        }
    });
};

wss.on('connection', ws => {
    console.log('new connection')
    ws.on('close', data => {
        console.log('connection closed')
    });
    ws.on('message', raw => {
        const data = JSON.parse(raw);
        if (data.type === 'get') {
            handleRequest(ws, data);
        } else {
            console.log('is else', data.type)
        }


        // Broadcast to everyone else.
        wss.clients.forEach(client => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(data);
            }
        });
    });
});

function handleRequest(ws, data) {
    const query = `SELECT value FROM cards where type = "${data.topic}";`;
    console.log(query);
    connection.query(query, (err, rows) => {
        if (err) throw err;
        var response = '';
        if (data.topic === 'whitecard') {
            response = getRandom(rows.map(r => r.value), data.count);
        } else {
            response = getRandom(rows.map(r => JSON.parse(r.value)))[0];
        }
        ws.send(JSON.stringify({ type: data.type, topic: data.topic, response: response }));
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