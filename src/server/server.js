const HTTP_Server = require('./HTTP_Server');
const WebSocket_Server = require('./Websocket_Server');
const DataBase = require('./DataBase');
const Game = require('./game/Game');
const CAS = require('../commonStrings');

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
    });
    db.getRandomCards(blackcard)
        .then(cloze => {
            game.newRound(cloze);
            sock.broadcast({ type: 'startGame' }, starter);
            sock.broadcast({ type: blackcard, response: cloze });
            const master = game.getCurrentRound().getMaster();
            sock.send(master, { type: 'role', role: CAS.role_master });
            sock.broadcast({ type: 'role', role: CAS.role_slave }, master);
            return players.filter(p => p !== master);
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

sock.onChooseCard(card => {
    const winner = game.getCurrentRound().getUsedCards().filter(c => c.card === card)[0].player;
    sock.broadcast({ type: 'winner', player: winner.name });
});

sock.onConfirmCard((player, card) => {
    console.log(`${card} from ${player.name} confirmed`);
    sock.send(game.getCurrentRound().getMaster(), { type: 'cardConfirmed' });
    game.confirmCard(player, card);
});

sock.onNextRound(player => {
    db.getRandomCards(blackcard)
    .then(cloze => {
        game.newRound(cloze);
        sock.broadcast({ type: 'nextRound' }, player);
        sock.broadcast({ type: blackcard, response: cloze });
        const master = game.getCurrentRound().getMaster();
        sock.send(master, { type: 'role', role: CAS.role_master });
        sock.broadcast({ type: 'role', role: CAS.role_slave }, master);
        return players.filter(p => p !== master);
    }).then(slaves =>
        db.getRandomCards(whitecard)
            .then(cards =>
                slaves.forEach(player =>
                    sock.send(player,
                        { type: whitecard, response: cards.splice(0, 1) })
                )
            )
    );
});
