const WebSocket = require("ws");
const { join } = require("path");
const express = require("express");
const enableWs = require("express-ws");
const { msgType } = require("../commonStrings");
const Player = require("./game/Player");

function ExpressServer() {
  this.app = express();
  this.wss = enableWs(this.app).getWss();
  this.app.use(express.static(join(__dirname, "..", "..", "dist")));
  this.app.use("/admin", express.static(join(__dirname, "..", "adminUI")));
  this.app.use(
    "/cardprovider",
    express.static(join(__dirname, "..", "cardprovider"))
  );

  this.players = [];
  this.getPlayer = function(ws) {
    return (
      this.players.find(player => player.socket === ws) || new Player("unknown")
    );
  };

  this.app.ws("/", (ws, req) => {
    const id = req.headers["sec-websocket-key"];
    console.log("new connection " + id);
    console.log(
      "open con",
      this.wss.clients.size,
      "cons",
      this.players.length,
      "players"
    );

    ws.on("close", (code, reason) => {
      console.log("closing data:", code, reason);
      const player = this.getPlayer(ws);
      const index = this.players.indexOf(player);
      if (index >= 0) {
        this.players.splice(index, 1);
        this.playerLeftCallback(player);
        console.log(player.name, "left");
      }
      console.log(
        "close con",
        this.wss.clients.size,
        "cons",
        this.players.length,
        "players"
      );
    });
    ws.on("message", raw => {
      console.log("new message: ", raw);
      const msg = JSON.parse(raw);
      if (msg.type === msgType.newPlayer) {
        const player = new Player(msg.name, id, ws);
        this.players.push(player);
        this.newPlayerCallback(player);
      } else if (msg.type === msgType.confirmCard) {
        this.confirmCardCallback(this.getPlayer(ws), msg.cards);
      } else if (msg.type === msgType.chooseCard) {
        this.chooseCardCallback(msg.cards);
      } else if (msg.type === msgType.nextRound) {
        this.nextRoundCallback(this.getPlayer(ws));
      } else if (msg.type === msgType.ready) {
        const player = this.getPlayer(ws);
        player.ready = true;
        const allReady = this.players.filter(p => !p.ready).length === 0;
        this.playerReadyCallback(player, allReady, this.players);
      } else {
        console.log("is else", msg.type);
      }
    });
  });
}
ExpressServer.prototype.get = function(route, callback) {
  this.app.get(route, callback);
};

ExpressServer.prototype.start = function(port) {
  var server = this.app.listen(port, () => {
    var host = server.address().address;
    var port = server.address().port;
    console.log("Example app listening at http://%s:%s", host, port);
  });
  return this;
};

ExpressServer.prototype.onPlayerReady = function(callback) {
  this.playerReadyCallback = callback;
};

ExpressServer.prototype.onNextRound = function(callback) {
  this.nextRoundCallback = callback;
};

ExpressServer.prototype.onChooseCard = function(callback) {
  this.chooseCardCallback = callback;
};

ExpressServer.prototype.onStartGame = function(callback) {
  this.startGameCallback = callback;
};

ExpressServer.prototype.onPlayerLeft = function(callback) {
  this.playerLeftCallback = callback;
};

ExpressServer.prototype.onNewPlayer = function(callback) {
  this.newPlayerCallback = callback;
};

ExpressServer.prototype.onConfirmCard = function(callback) {
  this.confirmCardCallback = callback;
};

ExpressServer.prototype.publishPlayers = function() {
  this.broadcast({
    type: msgType.userlist,
    users: this.players.map(player => ({
      name: player.name,
      ready: player.ready
    }))
  });
};

ExpressServer.prototype.broadcast = function(data, omit_player) {
  this.wss.clients.forEach(client => {
    const sock = omit_player ? omit_player.socket : null;

    if (client.readyState === WebSocket.OPEN && client !== sock) {
      client.send(JSON.stringify(data));
    } else {
      // console.log(this.getPlayer(client).name, "omitted");
    }
  });
};

ExpressServer.prototype.send = function(player, data) {
  if (player && player.socket.readyState === 1) {
    player.socket.send(JSON.stringify(data));
  } else {
    this.players.splice(this.players.indexOf(player), 1);
  }
};

module.exports = ExpressServer;
