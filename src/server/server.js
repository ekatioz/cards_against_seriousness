const HTTP_Server = require('./HTTP_Server');
const WebSocket_Server = require('./Websocket_Server');
const DataBase = require('./DataBase');
const Round = require('./game/Round');

const http = new HTTP_Server().start(8081);
const sock = new WebSocket_Server().start(13700);
const db = new DataBase();

var round;


sock.onPlayerLeft(player => {
    console.log(`${player.name} left`);
    sock.publishPlayers();
});
sock.onNewPlayer(player => {
    console.log(`${player.name} joined`);
    sock.publishPlayers();
});
sock.onStartGame((starter, players) => {
    console.log(`${starter.name} started a game`);
    round = new Round(players, starter);
    sock.broadcast({ type: 'startGame' }, starter);
    db.getRandomCards('blackcard', 1, response => {
        round.setCloze(response);
        sock.broadcast({ type: 'get', topic: 'blackcard', response: response });
    });
    round.getPlayers().forEach(player => {
        db.getRandomCards('whitecard', 5, response => {
            sock.send(player, { type: 'get', topic: 'whitecard', response: response })
        });
    });
});


sock.onConfirmCard((player, text) => {
    console.log(`${text} from ${player.name} confirmed`)
});



sock.onRequest((player, request) => {
    const { type, topic, count } = request;
    db.getRandomCards(topic, count, response => {
        sock.send(player, { type: type, topic: topic, response: response });
    });
});

