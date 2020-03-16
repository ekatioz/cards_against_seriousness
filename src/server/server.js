const shuffle = require("shuffle-array");
const ExpressServer = require("./ExpressServer");
const DataBase = require("./DataBaseMongo");
const Game = require("./game/Game");
const { msgType, role } = require("../commonStrings");
const Player = require("./game/Player");

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
    res.send(rows);
  });
});

express.get("/provide", (req, res) => {
  var { text, type } = req.query;
  db.addCard(type, text).then(() => res.send("done!"));
});

express.get("/delete", (req, res) => {
  var { id, type } = req.query;
  db.deleteCard(type, id).then(() => res.send("done!"));
});

express.on(msgType.playerLeft, (msg, id) => {
  const player = game ? game.removePlayer(id) : {};
  if (!game || !player) {
    return;
  }
  if (game.getPlayers().length > 0) {
    publishPlayers();
    if (
      game &&
      game.isRunning() &&
      player &&
      player.equals(game.getCurrentRound().getMaster())
    ) {
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

express.on(msgType.newPlayer, (msg, id) => {
  if (!game) game = new Game();
  const player = new Player(msg.name, id);
  game.addPlayer(player);
  publishPlayers();
  express.broadcast(
    {
      type: msgType.serverMessage,
      msg: `${player.name} ist beigetreten.`
    },
    player
  );
});

express.on(msgType.ready, (msg, id) => {
  const player = game.getPlayer(id);
  const players = game.getPlayers();
  player.ready = true;
  const allReady = players.filter(p => !p.ready).length === 0;
  publishPlayers();
  if (allReady) {
    if (!game || !game.isRunning()) startGame(players);
    else players.filter(player => player.new).forEach(joinGame);
  }
});

express.on(msgType.chooseCard, ({ cards }) => {
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

express.on(msgType.confirmCard, (msg, id) => {
  express.broadcast({ type: "cardConfirmed" });
  game.confirmCards(game.getPlayer(id), msg.cards);
});

express.on(msgType.nextRound, newRound);

express.on(msgType.revealCard, (msg, id) => {
  express.broadcast({ type: msgType.revealCard, card: msg.card }, id);
});

function publishPlayers() {
  express.broadcast({
    type: msgType.userlist,
    users: game.getPlayers().map(player => ({
      name: player.name,
      ready: player.ready
    }))
  });
}

function joinGame(player) {
  console.log("joinGame");
  console.log(player.name, "joined");
  distributeWhitecards([player], initialCards);
}

function startGame(players) {
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
      express.broadcast({
        type: "reveal",
        cards: shuffle(cards.map(group => group.cards))
      });
    });
    distributeWhitecards(players, initialCards);
    newRound();
  });
}

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
    express.send(player.id, {
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
  express.send(master.id, { type: msgType.role, role: role.master });
  express.broadcast({ type: msgType.role, role: role.slave }, master.id);
  express.broadcast({ type: msgType.nextRound, master: master.name });
  express.broadcast({ type: msgType.blackcard, response: cloze });
}
