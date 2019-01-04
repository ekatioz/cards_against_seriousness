const HTTP_Server = require('./HTTP_Server');
const WebSocket_Server = require('./Websocket_Server');
const DataBase = require('./DataBase');
const Game = require('./game/Game');

const http = new HTTP_Server().start(8081);
const sock = new WebSocket_Server().start(13700);
const db = new DataBase();

const blackcard = 'blackcard';
const whitecard = 'whitecard';

var game;


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
    game = new Game(players);
    db.getRandomCards(blackcard)
        .then(cloze => {
            game.newRound(cloze);
            sock.broadcast({ type: 'startGame' }, starter);
            sock.broadcast({ type: 'get', topic: blackcard, response: cloze });
            return players.filter(p => p !== game.getCurrentRound().getChooser());
        }).then(actualPlayers =>
            db.getRandomCards(whitecard, actualPlayers.length * 5)
                .then(cards => {
                    sock.send(actualPlayers[0], "Hallo!");
                    actualPlayers.forEach(player =>
                        sock.send(player,
                            { type: 'get', topic: whitecard, response: cards.splice(0, 5) })
                    );
                })
        );
});


sock.onConfirmCard((player, card) => {
    console.log(`${card} from ${player.name} confirmed`);
    game.getCurrentRound().confirmCard(player, card);
    sock.send(game.getCurrentRound().getChooser(),{type:"cardConfirmed"});
});



sock.onRequest((player, request) => {
    const { type, topic, count } = request;
    db.getRandomCards(topic, count, response => {
        sock.send(player, { type: type, topic: topic, response: response });
    });
});

