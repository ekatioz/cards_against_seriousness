const WebSocket = require("ws");
const Player = require("./game/Player");
const { msgType } = require("../commonStrings");

function WebSocket_Server() {
  this.players = [];
  this.getPlayer = function(ws) {
    return (
      this.players.find(player => player.socket === ws) || new Player("unknown")
    );
  };
}

WebSocket_Server.prototype.start = function(port) {
  this.wss = new WebSocket.Server({ port: port });

  this.wss.on("connection", (ws, req) => {
    const id = req.headers["sec-websocket-key"];
    console.log("new connection", id);
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
  return this;
};

WebSocket_Server.prototype.onPlayerReady = function(callback) {
  this.playerReadyCallback = callback;
};

WebSocket_Server.prototype.onNextRound = function(callback) {
  this.nextRoundCallback = callback;
};

WebSocket_Server.prototype.onChooseCard = function(callback) {
  this.chooseCardCallback = callback;
};

WebSocket_Server.prototype.onStartGame = function(callback) {
  this.startGameCallback = callback;
};

WebSocket_Server.prototype.onPlayerLeft = function(callback) {
  this.playerLeftCallback = callback;
};

WebSocket_Server.prototype.onNewPlayer = function(callback) {
  this.newPlayerCallback = callback;
};

WebSocket_Server.prototype.onConfirmCard = function(callback) {
  this.confirmCardCallback = callback;
};

WebSocket_Server.prototype.publishPlayers = function() {
  this.broadcast({
    type: msgType.userlist,
    users: this.players.map(player => ({
      name: player.name,
      ready: player.ready
    }))
  });
};

WebSocket_Server.prototype.broadcast = function(data, omit_player) {
  this.wss.clients.forEach(client => {
    const sock = omit_player ? omit_player.socket : null;

    if (client.readyState === WebSocket.OPEN && client !== sock) {
      client.send(JSON.stringify(data));
    } else {
      // console.log(this.getPlayer(client).name, "omitted");
    }
  });
};

WebSocket_Server.prototype.send = function(player, data) {
  if (player && player.socket.readyState === 1) {
    player.socket.send(JSON.stringify(data));
  } else {
    this.players.splice(this.players.indexOf(player), 1);
  }
};

module.exports = WebSocket_Server;
