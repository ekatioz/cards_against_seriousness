const HTTP_Server = require('./HTTP_Server');
const WebSocket_Server = require('./Websocket_Server');
const DataBase = require('./DataBase');
const Game = require('./game/Game');
const { msgType, role } = require('../commonStrings');

const http = new HTTP_Server().start(8081);
const sock = new WebSocket_Server().start(13700);
const db = new DataBase();

const initialCards = 5;

var game;

sock.onPlayerLeft(player => {
    if(game.getPlayers().length > 0){
        sock.publishPlayers();
        if (game && player.equals(game.getCurrentRound().getMaster())) {
            newRound();
        }
    } else {
        game = null;
    }
});

sock.onNewPlayer(player => {
    sock.publishPlayers();
});

sock.onPlayerReady((player, allReady, players) => {
    sock.publishPlayers();
    if (allReady) {
        if (!game || !game.isRunning()) startGame(players);
        else joinGame(player);
    }
});

function joinGame(player) {
    console.log(player.name, 'joined');
    game.addPlayer(player);
    distributeWhitecards([player], initialCards);
}

function startGame(players) {
    game = new Game(players);
    db.reloadCards().then(cardcounds => {
        sock.broadcast({ type: msgType.serverMessage, msg: `${cardcounds.whitecards} whitecards geladen.` });
        sock.broadcast({ type: msgType.serverMessage, msg: `${cardcounds.blackcards} blackcards geladen.` });
        game.onAllCardsConfirmed((master, cards) => {
            sock.send(master, { type: 'reveal', cards: cards.map(c => c.card) });
        });
        distributeWhitecards(players, initialCards);
        distributeBlackcards();
        distributeWhitecards(players.filter(p => p !== game.getCurrentRound().getMaster()));
    });
}

sock.onChooseCard(card => {
    const winner = game.getCurrentRound().getConfirmedCards().filter(c => c.card === card)[0].player;
    sock.broadcast({ type: msgType.winner, player: winner.name, card: card });
});

sock.onConfirmCard((player, card) => {
    //console.log(`${card} from ${player.name} confirmed`);
    sock.send(game.getCurrentRound().getMaster(), { type: 'cardConfirmed' });
    game.confirmCard(player, card);
});

sock.onNextRound(newRound);

function newRound() {
    distributeBlackcards();
    distributeWhitecards(game.getPlayers()
        .filter(p => p !== game.getCurrentRound().getMaster()));
}

function distributeBlackcards() {
    return setUpNewRound(db.getRandomCards(msgType.blackcard));
}

function distributeWhitecards(players, count = 1) {
    const cards = db.getRandomCards(msgType.whitecard, players.length * count);
    players.forEach(player =>
        sock.send(player, {
            type: msgType.whitecard,
            response: cards.splice(0, count)
        }));
}

function setUpNewRound(cloze) {
    game.newRound(cloze);
    const master = game.getCurrentRound().getMaster();
    sock.send(master, { type: msgType.role, role: role.master });
    sock.broadcast({ type: msgType.role, role: role.slave }, master);
    sock.broadcast({ type: msgType.nextRound, master: master.name });
    sock.broadcast({ type: msgType.blackcard, response: cloze });
}
