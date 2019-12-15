const WebSocket = require("ws");
const { join } = require("path");
const express = require("express");
const enableWs = require("express-ws");
const { msgType } = require("../commonStrings");
const uuidv4 = require("uuid/v4");
const cookieParser = require("cookie-parser");

function ExpressServer() {
  this.callbacks = {};
  this.app = express();
  this.wss = enableWs(this.app).getWss();
  this.app.use(cookieParser());
  this.app.use((req, res, next) => {
    if (!req.cookies.id) {
      res.cookie("id", uuidv4(), { maxAge: 900000 });
    }
    next();
  });
  this.app.use(express.static(join(__dirname, "..", "..", "dist")));
  this.app.use("/admin", express.static(join(__dirname, "..", "adminUI")));
  this.app.use(
    "/cardprovider",
    express.static(join(__dirname, "..", "cardprovider"))
  );

  this.app.ws("/", (ws, req) => {
    const id = uuidv4() || req.cookies.id;
    ws.id = id;
    console.log("new connection " + id);

    ws.on("close", (code, reason) => {
      console.log("closed connection " + id);
      console.log("closing data:", code, reason);
      if (this.callbacks[msgType.playerLeft]) {
        this.callbacks[msgType.playerLeft].forEach(callback =>
          callback({ type: msgType.playerLeft }, id)
        );
      }
    });

    ws.on("message", raw => {
      console.log("new message: [", id, "]", raw);
      const msg = JSON.parse(raw);
      if (this.callbacks[msg.type]) {
        this.callbacks[msg.type].forEach(callback => callback(msg, id));
      }
    });
  });
}

ExpressServer.prototype.get = function (route, callback) {
  this.app.get(route, callback);
};

ExpressServer.prototype.start = function (port) {
  var server = this.app.listen(port, () => {
    var host = server.address().address;
    var port = server.address().port;
    console.log("Example app listening at http://%s:%s", host, port);
  });
  return this;
};

ExpressServer.prototype.on = function (type, callback) {
  console.log("on", type, "registered");
  if (this.callbacks[type]) {
    console.log("pushed to ", type);
    this.callbacks[type].push(callback);
  } else {
    this.callbacks[type] = [callback];
  }
};

ExpressServer.prototype.broadcast = function (data, omit_player_id) {
  Array.from(this.wss.clients)
    .filter(client => client.readyState === WebSocket.OPEN)
    .filter(client => client.id !== (omit_player_id ? omit_player_id : null))
    .forEach(client => client.send(JSON.stringify(data)));
};

ExpressServer.prototype.send = function (player_id, data) {
  const socket = Array.from(this.wss.clients).find(
    client => client.id === player_id
  );
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(data));
  }
};

module.exports = ExpressServer;
