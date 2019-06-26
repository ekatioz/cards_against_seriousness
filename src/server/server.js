const shuffle = require("shuffle-array");
const HTTP_Server = require("./HTTP_Server");
const WebSocket_Server = require("./Websocket_Server");
const DataBase = require("./DataBaseMongo");
const Game = require("./game/Game");
const { msgType, role } = require("../commonStrings");

const http = new HTTP_Server().start(8081);
const sock = new WebSocket_Server().start(13700);
const db = new DataBase();

const initialCards = 5;

var game;

http.get("/userlist", (req, res) => {
  res.send(
    sock.players.map(player => ({
      id: player.id,
      name: player.name
    }))
  );
});

http.get("/kick", (req, res) => {
  const id = req.query.id;
  const player =
    sock.players.find(player => player.id === id) || new Player("unknown");
  player.socket.close();
  res.send({});
});

http.get("/cards", (req, res) => {
  var type = req.query.type;
  db.getCards(type).then(rows => {
    res.send(rows.map(r => r.value));
  });
});

http.get("/provide", (req, res) => {
  var { text, type } = req.query;
  db.addCard(type, text).then(() => res.send("done!"));
});

sock.onPlayerLeft(player => {
  if (sock.players.length > 0) {
    sock.publishPlayers();
    if (game && player.equals(game.getCurrentRound().getMaster())) {
      newRound();
    }
    sock.broadcast({
      type: msgType.serverMessage,
      msg: `${player.name} hat das Spiel verlassen.`
    });
  } else {
    game = null;
  }
});

sock.onNewPlayer(player => {
  sock.publishPlayers();
  sock.broadcast(
    { type: msgType.serverMessage, msg: `${player.name} ist beigetreten.` },
    player
  );
});

sock.onPlayerReady((player, allReady, players) => {
  sock.publishPlayers();
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
    sock.broadcast({
      type: msgType.serverMessage,
      msg: `${cardcounds.whitecards} whitecards geladen.`
    });
    sock.broadcast({
      type: msgType.serverMessage,
      msg: `${cardcounds.blackcards} blackcards geladen.`
    });
    game.onAllCardsConfirmed((master, cards) => {
      sock.send(master, {
        type: "reveal",
        cards: cards.map(group => group.cards)
      });
    });
    distributeWhitecards(players, initialCards);
    newRound();
  });
}

sock.onChooseCard(cards => {
  const winner = game
    .getCurrentRound()
    .getConfirmedCards()
    .filter(c => c.cards.every(card => cards.includes(card)))[0].player;
  winner.score++;
  const scores = game
    .getPlayers()
    .map(player => ({ name: player.name, score: player.score }));
  sock.broadcast({
    type: msgType.winner,
    player: winner.name,
    scores,
    cards
  });
});

sock.onConfirmCard((player, cards) => {
  sock.send(game.getCurrentRound().getMaster(), { type: "cardConfirmed" });
  game.confirmCards(player, cards);
});

sock.onNextRound(newRound);

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
    sock.send(player, {
      type: msgType.whitecard,
      response: cards.splice(0, count)
    })
  );
}

function setUpNewRound() {
  let cloze = "%p ist %w , weil %w.";
  const names = shuffle(game.getPlayers().map(p => p.name));
  let i = 0;
  while (cloze.includes("%p")) {
    cloze = cloze.replace("%p", names[i]);
    i++;
  }
  game.newRound(cloze);
  const master = game.getCurrentRound().getMaster();
  sock.send(master, { type: msgType.role, role: role.master });
  sock.broadcast({ type: msgType.role, role: role.slave }, master);
  sock.broadcast({ type: msgType.nextRound, master: master.name });
  sock.broadcast({ type: msgType.blackcard, response: cloze });
}
