const HTTP_Server = require('./HTTP_Server');
const WebSocket_Server = require('./Websocket_Server');
const DataBase = require('./DataBase');
const Game = require('./game/Game');

const http = new HTTP_Server().start(8081);
const sock = new WebSocket_Server().start(13700);
const db = new DataBase();

const blackcard = 'blackcard';
const whitecard = 'whitecard';

const initialCards = 8;

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
    game.onAllCardsConfirmed((master, cards) => {
        console.log(cards);
        sock.send(master, { type: 'reveal', cards: cards.map(c => c.card) });
    }
    );
    db.getRandomCards(blackcard)
        .then(cloze => {
            game.newRound(cloze);
            sock.broadcast({ type: 'startGame' }, starter);
            sock.broadcast({ type: blackcard, response: cloze });
            return players.filter(p => p !== game.getCurrentRound().getMaster());
        }).then(slaves =>
            db.getRandomCards(whitecard, slaves.length * initialCards)
                .then(cards =>
                    slaves.forEach(player =>
                        sock.send(player,
                            { type: whitecard, response: cards.splice(0, initialCards) })
                    )
                )
        );
});


sock.onConfirmCard((player, card) => {
    console.log(`${card} from ${player.name} confirmed`);
    sock.send(game.getCurrentRound().getMaster(), { type: 'cardConfirmed' });
    game.confirmCard(player, card);
});
