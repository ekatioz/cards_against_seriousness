const WebSocket = require('ws');
const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/";
const wss = new WebSocket.Server({ port: 13700 });

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
    ws.on('message',raw => {
        const data = JSON.parse(raw);
        if (data.type === 'get') {
            handleRequest(ws,data);
        }else{
            console.log('is else',data.type)
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
    MongoClient.connect(url, (err, db) => {
        if (err) throw err;
        const dbo = db.db("cards_against");
        dbo.collection("cards").find({type:data.topic},{ projection: { _id: 0, type: 0} }).toArray((err, result) => {
          if (err) throw err;
          const response = getRandom(result.map(r => r.text),data.count);
          ws.send(JSON.stringify({type:data.type,topic:data.topic,response:response}));
          console.log(response);
          db.close();
        });
      });
    
}


function getRandom(arr, n) {
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