const HTTP_Server = require('./HTTP_Server');
const WebSocket_Server = require('./Websocket_Server');
const DataBase = require('./DataBase');
const Game = require('./game/Game');
const {msgType, role} = require('../commonStrings');

const http = new HTTP_Server().start(8081);
const sock = new WebSocket_Server().start(13700);
const db = new DataBase();

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

sock.onPlayerReady((player, allReady, players) => {
    console.log(`${player.name} is ready`);
    sock.publishPlayers();
    if(allReady) startGame(players);
});

function startGame(players) {
    console.log('Starting a new Game');
    game = new Game(players);
    game.onAllCardsConfirmed((master, cards) => {
        sock.send(master, { type: 'reveal', cards: cards.map(c => c.card) });
    });
    db.getRandomCards(msgType.blackcard)
        .then(cloze => {
            game.newRound(cloze);
            const master = game.getCurrentRound().getMaster();
            sock.send(master, { type: 'role', role: role.master });
            sock.broadcast({ type: 'role', role: role.slave }, master);
            sock.broadcast({ type: msgType.startGame });
            sock.broadcast({ type: msgType.blackcard, response: cloze });
            return players.filter(p => p !== master);
        }).then(slaves =>
            db.getRandomCards(msgType.whitecard, slaves.length * initialCards)
                .then(cards =>
                    slaves.forEach(player =>
                        sock.send(player,
                            { type: msgType.whitecard, response: cards.splice(0, initialCards) })
                    )
                )
        );
}

sock.onChooseCard(card => {
    const winner = game.getCurrentRound().getUsedCards().filter(c => c.card === card)[0].player;
    sock.broadcast({ type: 'winner', player: winner.name, card:card });
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
        return game.getPlayers().filter(p => p !== master);
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
