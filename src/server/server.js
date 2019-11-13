const shuffle = require("shuffle-array");
const HTTP_Server = require("./HTTP_Server");
const WebSocket_Server = require("./Websocket_Server");
const ExpressServer = require("./ExpressServer");
const DataBase = require("./DataBaseMongo");
const Game = require("./game/Game");
const { msgType, role } = require("../commonStrings");

const express = new ExpressServer().start(8081);
const db = new DataBase();

const initialCards = 5;

var game;

express.get("/userlist", (req, res) => {
  res.send(
    express.players.map(player => ({
      id: player.id,
      name: player.name
    }))
  );
});

express.get("/kick", (req, res) => {
  const id = req.query.id;
  const player =
    express.players.find(player => player.id === id) || new Player("unknown");
  player.socket.close();
  res.send({});
});

express.get("/cards", (req, res) => {
  var type = req.query.type;
  db.getCards(type).then(rows => {
    res.send(rows.map(r => r.value));
  });
});

express.get("/provide", (req, res) => {
  var { text, type } = req.query;
  db.addCard(type, text).then(() => res.send("done!"));
});

express.onPlayerLeft(player => {
  if (express.players.length > 0) {
    express.publishPlayers();
    if (game && player.equals(game.getCurrentRound().getMaster())) {
      newRound();
    }
    express.broadcast({
      type: msgType.serverMessage,
      msg: `${player.name} hat das Spiel verlassen.`
    });
  } else {
    game = null;
  }
});

express.onNewPlayer(player => {
  express.publishPlayers();
  express.broadcast(
    { type: msgType.serverMessage, msg: `${player.name} ist beigetreten.` },
    player
  );
});

express.onPlayerReady((player, allReady, players) => {
  express.publishPlayers();
  if (allReady) {
    if (!game || !game.isRunning()) startGame(players);
    else joinGame(player);
  }
});

function joinGame(player) {
  console.log(player.name, "joined");
  game.addPlayer(player);
  distributeWhitecards([player], initialCards);
}

function startGame(players) {
  game = new Game(players);
  db.reloadCards().then(cardcounds => {
    express.broadcast({
      type: msgType.serverMessage,
      msg: `${cardcounds.whitecards} whitecards geladen.`
    });
    express.broadcast({
      type: msgType.serverMessage,
      msg: `${cardcounds.blackcards} blackcards geladen.`
    });
    game.onAllCardsConfirmed((master, cards) => {
      express.send(master, {
        type: "reveal",
        cards: cards.map(group => group.cards)
      });
    });
    distributeWhitecards(players, initialCards);
    newRound();
  });
}

express.onChooseCard(cards => {
  const winner = game
    .getCurrentRound()
    .getConfirmedCards()
    .filter(c => c.cards.every(card => cards.includes(card)))[0].player;
  winner.score++;
  const scores = game
    .getPlayers()
    .map(player => ({ name: player.name, score: player.score }));
  express.broadcast({
    type: msgType.winner,
    player: winner.name,
    scores,
    cards
  });
});

express.onConfirmCard((player, cards) => {
  express.send(game.getCurrentRound().getMaster(), { type: "cardConfirmed" });
  game.confirmCards(player, cards);
});

express.onNextRound(newRound);

function newRound() {
  setUpNewRound();
  distributeWhitecards(
    game.getPlayers().filter(p => p !== game.getCurrentRound().getMaster())
  );
}

function distributeWhitecards(
  players,
  count = game.getCurrentRound().getDesiredWhitecards()
) {
  const cards = db.getRandomCards(msgType.whitecard, players.length * count);
  players.forEach(player =>
    express.send(player, {
      type: msgType.whitecard,
      response: cards.splice(0, count)
    })
  );
}

function setUpNewRound() {
  let cloze = db.getRandomCards(msgType.blackcard)[0];
  const names = shuffle(game.getPlayers().map(p => p.name));
  let i = 0;
  while (cloze.includes("%p")) {
    cloze = cloze.replace("%p", names[i]);
    i++;
  }
  game.newRound(cloze);
  const master = game.getCurrentRound().getMaster();
  express.send(master, { type: msgType.role, role: role.master });
  express.broadcast({ type: msgType.role, role: role.slave }, master);
  express.broadcast({ type: msgType.nextRound, master: master.name });
  express.broadcast({ type: msgType.blackcard, response: cloze });
}
