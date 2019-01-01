const WebSocket = require('ws');
const Player = require('./game/Player');

function WebSocket_Server() {
    this.players = [];
    this.getPlayer = function (ws) {
        return this.players.find((player) => (player.socket === ws));
    }
}


WebSocket_Server.prototype.start = function (port) {
    this.wss = new WebSocket.Server({ port: port });

    this.wss.on('connection', ws => {
        console.log('new connection')
        ws.on('close', data => {
            const player = this.getPlayer(ws);
            this.players.splice(this.players.indexOf(player), 1);
            this.playerLeftCallback(player);
        });
        ws.on('message', raw => {
            const data = JSON.parse(raw);
            if (data.type === 'get') {
                this.requestCallback(this.getPlayer(ws), data);
            } else if (data.type === 'newUser') {
                const player = new Player(data.name, ws);
                this.players.push(player);
                this.newPlayerCallback(player);
            } else if (data.type === 'confirmCard') {
                this.confirmCardCallback(this.getPlayer(ws), data.text);
            } else if (data.type === 'startGame') {
                this.startGameCallback(this.getPlayer(ws),this.players);
            }else{
                console.log('is else', data.type)
            }
        });
    });
    return this;
}
WebSocket_Server.prototype.onStartGame = function (callback) {
    this.startGameCallback = callback;
}

WebSocket_Server.prototype.onRequest = function (callback) {
    this.requestCallback = callback;
}

WebSocket_Server.prototype.onPlayerLeft = function (callback) {
    this.playerLeftCallback = callback;
}

WebSocket_Server.prototype.onNewPlayer = function (callback) {
    this.newPlayerCallback = callback;
}

WebSocket_Server.prototype.onConfirmCard = function (callback) {
    this.confirmCardCallback = callback;
}

WebSocket_Server.prototype.publishPlayers = function () {
    this.broadcast({ type: 'userlist', users: this.players.map(player => player.name) });
}

WebSocket_Server.prototype.broadcast = function (data, omit) {
    this.wss.clients.forEach(client => {
        const sock = omit?omit.socket:null;

        if (client.readyState === WebSocket.OPEN && client !== sock) {
            client.send(JSON.stringify(data));
        }else{
            console.log(this.getPlayer(client).name , "omitted")
        }
    });
}

WebSocket_Server.prototype.send = function (player, data) {
    player.socket.send(JSON.stringify(data));
}

module.exports = WebSocket_Server;